import re

with open('lib/dummyDataPasien.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update PERIOD_IDX
content = re.sub(
    r'export const PERIOD_IDX: Record<number, number> = \{.*?\};',
    'export const PERIOD_IDX: Record<number, number> = { 0:0, 1:1, 2:2, 3:3, 4:4, 6:5, 12:6, 18:7, 24:8, 30:9, 36:10 };',
    content
)

# Update types
content = content.replace(
    'statusByPeriod:    [StatusGizi,    StatusGizi,    StatusGizi,    StatusGizi,    StatusGizi,    StatusGizi,    StatusGizi   ];',
    'statusByPeriod:    [StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi, StatusGizi];'
)
content = content.replace(
    'statusIbuByPeriod: [StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu];',
    'statusIbuByPeriod: [StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu, StatusGiziIbu];'
)

# Update constants
patterns = {
    'bNN': '[N,N,N,N,N,N,N,N,N,N,N]',
    'bT_M2': '[T,N,N,N,N,N,N,N,N,N,N]',
    'bT_M3': '[T,T,N,N,N,N,N,N,N,N,N]',
    'bT_M4': '[T,T,T,N,N,N,N,N,N,N,N]',
    'bT_M5': '[T,T,T,T,N,N,N,N,N,N,N]',
    'bT6': '[T,T,T,T,T,N,N,N,N,N,N]',
    'bT12': '[T,T,T,T,T,T,N,N,N,N,N]',
    'bT18': '[T,T,T,T,T,T,T,N,N,N,N]',
    'bT24': '[T,T,T,T,T,T,T,T,N,N,N]',
    'bS12': '[S,S,S,S,S,T,N,N,N,N,N]',
    'bS18': '[S,S,S,S,S,S,T,N,N,N,N]',
    'bS24': '[S,S,S,S,S,S,S,T,N,N,N]',
    'bS30': '[S,S,S,S,S,S,S,S,T,N,N]',
    'bS36': '[S,S,S,S,S,S,S,S,S,T,N]',
    'iNN': '[n,n,n,n,n,n,n,n,n,n,n]',
    'iM6': '[m,m,m,m,m,n,n,n,n,n,n]',
    'iM12': '[m,m,m,m,m,m,n,n,n,n,n]',
    'iM18': '[m,m,m,m,m,m,m,n,n,n,n]',
    'iM24': '[m,m,m,m,m,m,m,m,n,n,n]',
    'iM30': '[m,m,m,m,m,m,m,m,m,n,n]',
    'iM36': '[m,m,m,m,m,m,m,m,m,m,n]',
    r'\[S,S,T,T,N,N,N\]': '[S,S,S,S,S,S,T,T,N,N,N]',
    r'\[S,S,S,T,T,N,N\]': '[S,S,S,S,S,S,S,T,T,N,N]'
}

# Replace old pattern definitions
for pat in ['bNN', 'bT6', 'bT12', 'bT18', 'bT24', 'bS12', 'bS18', 'bS24', 'bS30', 'bS36']:
    content = re.sub(fr'const {pat}:\s*Pasien\["statusByPeriod"\] = \[.*?\];', f'const {pat}: Pasien["statusByPeriod"] = {patterns[pat]};', content)

for pat in ['iNN', 'iM6', 'iM12', 'iM18', 'iM24', 'iM30', 'iM36']:
    content = re.sub(fr'const {pat}:\s*Pasien\["statusIbuByPeriod"\] = \[.*?\];', f'const {pat}: Pasien["statusIbuByPeriod"] = {patterns[pat]};', content)

content = re.sub(r'\[S,S,T,T,N,N,N\]', patterns[r'\[S,S,T,T,N,N,N\]'], content)
content = re.sub(r'\[S,S,S,T,T,N,N\]', patterns[r'\[S,S,S,T,T,N,N\]'], content)

# Add new patterns
new_pats = """const bT_M2: Pasien["statusByPeriod"] = [T,N,N,N,N,N,N,N,N,N,N];
const bT_M3: Pasien["statusByPeriod"] = [T,T,N,N,N,N,N,N,N,N,N];
const bT_M4: Pasien["statusByPeriod"] = [T,T,T,N,N,N,N,N,N,N,N];
const bT_M5: Pasien["statusByPeriod"] = [T,T,T,T,N,N,N,N,N,N,N];"""

content = content.replace('const bT6:', new_pats + '\nconst bT6:')

# We need to distribute the 50 T patients into 10 bT_M2, 5 bT_M3, 15 bT_M4, 20 bT_M5.
lines = content.split('\n')
t_patients = []
for i, line in enumerate(lines):
    if 'mk("PS-' in line and any(x in line for x in ['bT6', 'bT12', 'bT18', 'bT24']):
        t_patients.append(i)

assert len(t_patients) == 50, f"Found {len(t_patients)} T patients"

# 10 to bT_M2, 5 to bT_M3, 15 to bT_M4, 20 to bT_M5
assignments = ['bT_M2']*10 + ['bT_M3']*5 + ['bT_M4']*15 + ['bT_M5']*20
for idx, new_pat in zip(t_patients, assignments):
    line = lines[idx]
    line = re.sub(r'bT(6|12|18|24)', new_pat, line)
    lines[idx] = line

with open('lib/dummyDataPasien.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
