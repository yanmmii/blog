---
title: 'AutoDock Benchmark Guidance'
date: '2025-10-19'
excerpt: ''
---

# 基準測試操作指南（Benchmark Guidance）

## 1. 測試環境

### 1.1 硬體／作業系統
- CPU：型號、實體核心數、是否啟用超執行緒（HT）
- RAM：容量（GB）、記憶體頻寬（可省略）
- 儲存：NVMe / SATA（選填）
- OS：發行版與版號（例如 Ubuntu 22.04）、Linux kernel 版本
- 建議以兩種 HT 設定各跑一次（HT on / off），利於分析差異。

### 1.2 版本與指紋（務必存檔）
請在每次跑測試前，先建立 `baseline/env/` 目錄並保存下列指紋檔案：

```bash
mkdir -p baseline/env
lscpu > baseline/env/lscpu.txt
uname -a > baseline/env/uname.txt
cat /etc/os-release > baseline/env/os-release.txt
# 版本與 commit 由步驟 2.1 取得，存到 baseline/env/versions.txt
```

### 1.3 時間量測與重複次數
- 時間工具：`/usr/bin/time -v`（擷取 wall-clock、CPU 使用、峰值記憶體）
- 重複：每個組合至少重複 3 次，計平均與 95% CI
- 隨機種子：固定；Vina 用 `--seed`；AD4 用 `seed`/`rmstol` 類參數固定（見後文）

## 2. 測試軟體（Software Under Test）

### 2.1 必備工具
- AutoDock4（含 `autogrid4`）：CPU 對接器，需先做格點地圖
- AutoDock Vina（1.2.x）：CPU 對接器，內建格點
- Meeko：`mk_prepare_receptor.py` / `mk_prepare_ligand.py`（PDB→PDBQT）
- Open Babel 或 RDKit：格式轉換與 RMSD 計算（下文提供指令）
- pdbfixer（可選）：補缺殘基、加氫

安裝方式不限（Conda / 模組 / 系統套件皆可）。務必記錄實際版號與 commit 到 `baseline/env/versions.txt`，例如：

```bash
vina --version >> baseline/env/versions.txt
autodock4 --version >> baseline/env/versions.txt  # 若無 --version，記錄二進位檔時間與來源
autogrid4 --version >> baseline/env/versions.txt
python - <<'PY' >> baseline/env/versions.txt
import meeko, rdkit
print('meeko', meeko.__version__)
print('rdkit', rdkit.__version__)
PY
```

## 3. 測試集（Datasets）

我們使用 140 組蛋白-配體複合體的 re-dock 集合作為主對照（Astex Diversity、CASF-2013、PDB 若干），每組系統包含：

```
<target_id>/
  receptor.pdb     # 或原始 PDB（清理前）
  ligand.sdf/mol2  # 共結晶配體
  box.txt          # 口袋中心與盒大小：center_x/y/z, size_x/y/z
```

- 若已有作者打包好的 `receptor.pdbqt` / `ligand.pdbqt` / `config.txt`，可直接用；沒有的話，照本手冊的「準備步驟」重建。

分桶（後續報表請分層彙整）：
- small：配體原子數 5–23
- medium：24–36
- large：37–108

## 4. 目錄規範（請依此建立）

```
baseline/
├── env/                # 環境指紋與版本
├── datasets/
│   └── 140set/
│       └── <target_id>/
│           ├── receptor.pdb
│           ├── ligand.sdf
│           └── box.txt
├── prepared/
│   └── <target_id>/        # 準備好的 PDBQT 與格點檔
│       ├── receptor.pdbqt
│       ├── ligand_vina.pdbqt
│       ├── ligand_ad4.pdbqt
│       ├── <target_id>.gpf
│       └── <target_id>.maps.fld
├── runs/
│   ├── vina_cpu/
│   │   └── <target_id>/    # Vina 執行結果 (run 1, 2, 3)
│   │       ├── out.pdbqt
│   │       ├── log.txt
│   │       └── time.txt
│   └── ad4_cpu/
│       └── <target_id>/    # AD4 執行結果 (run 1, 2, 3)
│           ├── out.dlg
│           ├── log.txt
│           └── time.txt
└── results/
    ├── scores_vina.csv   # 逐筆 Vina 詳細成績
    ├── scores_ad4.csv    # 逐筆 AD4 詳細成績
    └── metrics.csv       # 最終彙總 (平均時間、RMSD 成功率、CI)
```

## 5. Step by Step 操作指南

以下命令以 Linux 終端為例；所有 `...` 代表你要填的路徑或數值。

### 5.1 準備：受體／配體 → PDBQT

#### 5.1.1 受體清理與轉檔

- 可選：用 pdbfixer 清理

```bash
python - <<'PY'
from pdbfixer import PDBFixer
from openmm.app import PDBFile
fixer = PDBFixer(filename="baseline/datasets/140set/<target_id>/receptor.pdb")
fixer.findMissingResidues(); fixer.findMissingAtoms(); fixer.addMissingAtoms()
fixer.addHydrogens(pH=7.4)
PDBFile.writeFile(
    fixer.topology,
    fixer.positions,
    open("baseline/prepared/<target_id>/receptor_clean.pdb","w")
)
PY
```

- 轉 PDBQT（受體）

```bash
mk_prepare_receptor.py -r baseline/prepared/<target_id>/receptor_clean.pdb \
  -o baseline/prepared/<target_id>/receptor.pdbqt
```

#### 5.1.2 配體 3D 與轉檔

- 產生配體 3D（若原始是 SMILES/MOL2）

```bash
obabel baseline/datasets/140set/<target_id>/ligand.sdf \
  -O baseline/prepared/<target_id>/ligand.sdf --gen3d
```

- 轉 PDBQT（Vina/AD4 可共用；若要嚴格對齊，可各自導出一份）

```bash
mk_prepare_ligand.py -i baseline/prepared/<target_id>/ligand.sdf \
  -o baseline/prepared/<target_id>/ligand_vina.pdbqt
cp baseline/prepared/<target_id>/ligand_vina.pdbqt \
   baseline/prepared/<target_id>/ligand_ad4.pdbqt
```

#### 5.1.3 口袋盒（box）設定

請在 `baseline/datasets/140set/<target_id>/box.txt` 填入：

```
center_x=<cx>
center_y=<cy>
center_z=<cz>
size_x=<sx>
size_y=<sy>
size_z=<sz>
```

- 有共結晶配體就用配體中心及能包住它的盒；若有作者提供的 `config.txt`，直接照抄。

### 5.2 AutoDock Vina（CPU）基準

#### 5.2.1 執行（固定口徑）

- 必填：`center_*` / `size_*` 由 `box.txt` 提供
- 搜尋深度：`--exhaustiveness 128`
- 執行緒：`--cpu 20`（若目標機核數不足，填可用的最大實體核心並記錄）
- 輸出姿勢數：`--num_modes 20`
- 種子：固定 `--seed 2025`

```bash
# 讀取 box 變數（bash）
source baseline/datasets/140set/<target_id>/box.txt

# 跑 & 記錄時間
/usr/bin/time -v vina \
  --receptor baseline/prepared/<target_id>/receptor.pdbqt \
  --ligand   baseline/prepared/<target_id>/ligand_vina.pdbqt \
  --center_x $center_x --center_y $center_y --center_z $center_z \
  --size_x   $size_x   --size_y   $size_y   --size_z   $size_z \
  --exhaustiveness 128 --num_modes 20 --cpu 20 --seed 2025 \
  --out baseline/runs/vina_cpu/<target_id>/out.pdbqt \
  --log baseline/runs/vina_cpu/<target_id>/log.txt \
  2> baseline/runs/vina_cpu/<target_id>/time.txt
```

> 重複 3 次（不同 run 目錄），後續取平均與 95% CI。

### 5.3 AutoDock4（CPU）基準

#### 5.3.1 建格點（AutoGrid）

格點間距建議 0.375 Å；格點數（`npts`）依盒大小換算（確保盒完全覆蓋），各原子型皆要一張地圖。建立 `<target_id>.gpf`，例如：

```text
npts  60 60 60
gridcenter  <cx> <cy> <cz>
spacing 0.375
receptor_types  A C HD N NA OA SA  # 依實際受體原子型
ligand_types    A C HD N NA OA SA  # 依配體原子型
receptor  baseline/prepared/<target_id>/receptor.pdbqt
gridfld  baseline/prepared/<target_id>/<target_id>.maps.fld
```

執行：

```bash
autogrid4 -p baseline/prepared/<target_id>/<target_id>.gpf \
          -l baseline/prepared/<target_id>/<target_id>.glg
```

#### 5.3.2 對接參數（AutoDock4 DPF）

建立 `<target_id>.dpf`（Lamarckian GA）：

```text
autodock_parameter_version 4.2
intelec
seed 2025
ligand_types A C HD N NA OA SA
fld  baseline/prepared/<target_id>/<target_id>.maps.fld
map  baseline/prepared/<target_id>/<target_id>.C.map
map  baseline/prepared/<target_id>/<target_id>.OA.map
# ... 為所有用到的 map 列出一行
elecmap baseline/prepared/<target_id>/<target_id>.e.map
desolvmap baseline/prepared/<target_id>/<target_id>.d.map
move baseline/prepared/<target_id>/ligand_ad4.pdbqt
about 0.0 0.0 0.0
tran0 0.0 0.0 0.0
quaternion0 0.0 0.0 0.0 1.0
# LGA 搜尋設定（較嚴）
ga_run 50
ga_pop_size 150
ga_num_evals 2500000
ga_num_generations 27000
ga_elitism 1
rmstol 2.0
sw_max_its 300
ls_search_freq 0.06
```

#### 5.3.3 執行與記錄

```bash
/usr/bin/time -v autodock4 \
  -p baseline/prepared/<target_id>/<target_id>.dpf \
  -l baseline/runs/ad4_cpu/<target_id>/out.dlg \
  2> baseline/runs/ad4_cpu/<target_id>/time.txt
```

> 同樣重複 3 次。若 CPU 單機時間過長，可先以 `ga_run 20` 小跑確認流程，正式資料請回到 `ga_run 50`。

### 5.4 計算 RMSD 與彙整 CSV

#### 5.4.1 取 Top-1 姿勢
- Vina：讀 `log.txt` 的第一名分數；或解析 `out.pdbqt` 第一個 `MODEL`
- AD4：在 `.dlg` 內找最優解（`DOCKED: USER    Estimated Free Energy of Binding` 最低者）

#### 5.4.2 RMSD（相對共結晶配體）

以 Open Babel 為例：

```bash
# 先把 crystal ligand 與預測姿勢都轉成同一格式（SDF）
obabel baseline/datasets/140set/<target_id>/ligand.sdf -O crystal.sdf --addtotitle crystal

# Vina Top-1（out.pdbqt 會輸出多個，如需僅第1個請保留 #01）
obabel baseline/runs/vina_cpu/<target_id>/out.pdbqt -O vina_top1.sdf -m
obrms crystal.sdf vina_top1_01.sdf > baseline/runs/vina_cpu/<target_id>/rmsd.txt

# AD4 Top-1（從 .dlg 抽出第一個 pose 再轉 SDF，視工具鏈而定）
# 某些發行版附有 autodock_tools 的腳本可直接抽取 pose
```

#### 5.4.3 匯出 CSV（手工或用簡單腳本）

建立 `baseline/results/scores_vina.csv`、`baseline/results/scores_ad4.csv`，欄位建議：

```text
target_id, family_bucket, seed, run_idx, wall_clock_sec, peak_mem_MB, best_score, top1_rmsd_A
```

說明：`family_bucket = small/medium/large`（依配體原子數）；請確實填 `seed` 與 `run_idx`（1/2/3）。

#### 5.4.4 產出 metrics.csv

對每個 `family_bucket` 與全體，請彙整：
- 時間：平均 wall-clock（±95% CI）
- 準確度：Top-1 ≤ 2 Å 成功率（%）
- （選填）分數統計：最佳分數的平均與標準差

## 6. 最終交付（Checklist）

- `baseline/env/`：`lscpu.txt`、`os-release.txt`、`uname.txt`、`versions.txt`
- `baseline/prepared/`：每個 target 的 `.pdbqt`、`.gpf`、`.maps.fld`（AD4）
- `baseline/runs/`：Vina 與 AD4 的 `out.*`、`log.txt`、`time.txt`
- `baseline/results/`：`scores_vina.csv`、`scores_ad4.csv`、`metrics.csv`
- 一頁說明：HT on/off、`--cpu` 實際值、`ga_run` 等
