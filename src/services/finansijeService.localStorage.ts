// LocalStorage Finansije Service za demo verziju

export interface DemoFinansija {
  id: string;
  tip: 'prihod' | 'rashod';
  kategorija: string;
  opis: string;
  iznos: number;
  datum: string;
  vozilo?: string;
  dokument?: string;
  napomene?: string;
  createdAt: string;
  updatedAt: string;
}

// Demo finansije
const getDefaultFinansije = (): DemoFinansija[] => [
  {
    id: '1',
    tip: 'prihod',
    kategorija: 'Transport robe',
    opis: 'Prevoz kontejnera Beograd-Hamburg',
    iznos: 2500,
    datum: '2024-10-20',
    vozilo: 'BG-123-AB',
    dokument: 'INV-2024-001',
    napomene: 'Plaćeno unapred',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    tip: 'rashod',
    kategorija: 'Gorivo',
    opis: 'Dizel gorivo - OMV stanica',
    iznos: 450,
    datum: '2024-10-19',
    vozilo: 'NS-456-CD',
    dokument: 'REC-2024-015',
    napomene: 'Tankovanje na autoputu',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    tip: 'prihod',
    kategorija: 'Transport robe',
    opis: 'Dostava građevinskog materijala',
    iznos: 1800,
    datum: '2024-10-18',
    vozilo: 'KG-789-EF',
    dokument: 'INV-2024-002',
    napomene: 'Lokalna dostava',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    tip: 'rashod',
    kategorija: 'Održavanje',
    opis: 'Zamena guma - komplet',
    iznos: 1200,
    datum: '2024-10-17',
    vozilo: 'NI-321-GH',
    dokument: 'REC-2024-016',
    napomene: 'Zimske gume',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    tip: 'prihod',
    kategorija: 'Transport robe',
    opis: 'Selidba - privatni klijent',
    iznos: 800,
    datum: '2024-10-16',
    vozilo: 'SU-654-IJ',
    dokument: 'INV-2024-003',
    napomene: 'Jednodnevni posao',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    tip: 'rashod',
    kategorija: 'Putarine',
    opis: 'Autoput Beograd-Novi Sad',
    iznos: 180,
    datum: '2024-10-15',
    vozilo: 'BG-123-AB',
    dokument: 'REC-2024-017',
    napomene: 'Povratna karta',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    tip: 'rashod',
    kategorija: 'Osiguranje',
    opis: 'Godišnje osiguranje vozila',
    iznos: 2200,
    datum: '2024-10-14',
    vozilo: 'NS-456-CD',
    dokument: 'POL-2024-001',
    napomene: 'Kasko osiguranje',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    tip: 'prihod',
    kategorija: 'Transport robe',
    opis: 'Međunarodni transport - Austrija',
    iznos: 3200,
    datum: '2024-10-13',
    vozilo: 'NI-321-GH',
    dokument: 'INV-2024-004',
    napomene: 'Evropska ruta',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    tip: 'rashod',
    kategorija: 'Gorivo',
    opis: 'Dizel gorivo - MOL stanica',
    iznos: 520,
    datum: '2024-10-12',
    vozilo: 'KG-789-EF',
    dokument: 'REC-2024-018',
    napomene: 'Puno tankovanje',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    tip: 'rashod',
    kategorija: 'Održavanje',
    opis: 'Redovan servis vozila',
    iznos: 850,
    datum: '2024-10-11',
    vozilo: 'SU-654-IJ',
    dokument: 'REC-2024-019',
    napomene: 'Zamena ulja i filtera',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const STORAGE_KEY = 'spedicija_demo_finansije';

// Inicijalizuj finansije ako ne postoje
const initializeFinansije = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getDefaultFinansije()));
  }
};

// Dobij sve finansije
const getFinansije = (): DemoFinansija[] => {
  initializeFinansije();
  const finansije = localStorage.getItem(STORAGE_KEY);
  return finansije ? JSON.parse(finansije) : getDefaultFinansije();
};

// Sačuvaj finansije
const saveFinansije = (finansije: DemoFinansija[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(finansije));
};

/**
 * Dobij sve finansije
 */
export async function getAllFinansije() {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const finansije = getFinansije();
    return { success: true, data: finansije };
  } catch (error: any) {
    console.error('Get finansije error:', error);
    return { success: false, error: 'Greška pri dobijanju finansija' };
  }
}

/**
 * Dobij finansiju po ID
 */
export async function getFinansijaById(id: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const finansije = getFinansije();
    const finansija = finansije.find(f => f.id === id);
    
    if (!finansija) {
      return { success: false, error: 'Finansija nije pronađena' };
    }
    
    return { success: true, data: finansija };
  } catch (error: any) {
    console.error('Get finansija by ID error:', error);
    return { success: false, error: 'Greška pri dobijanju finansije' };
  }
}

/**
 * Kreiraj novu finansiju
 */
export async function createFinansija(finansijaData: Omit<DemoFinansija, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const finansije = getFinansije();
    
    const novaFinansija: DemoFinansija = {
      ...finansijaData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    finansije.unshift(novaFinansija); // Dodaj na početak za hronološki redosled
    saveFinansije(finansije);
    
    return { success: true, data: novaFinansija };
  } catch (error: any) {
    console.error('Create finansija error:', error);
    return { success: false, error: 'Greška pri kreiranju finansije' };
  }
}

/**
 * Ažuriraj finansiju
 */
export async function updateFinansija(id: string, finansijaData: Partial<Omit<DemoFinansija, 'id' | 'createdAt'>>) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const finansije = getFinansije();
    const finansijaIndex = finansije.findIndex(f => f.id === id);
    
    if (finansijaIndex === -1) {
      return { success: false, error: 'Finansija nije pronađena' };
    }
    
    finansije[finansijaIndex] = {
      ...finansije[finansijaIndex],
      ...finansijaData,
      updatedAt: new Date().toISOString()
    };
    
    saveFinansije(finansije);
    
    return { success: true, data: finansije[finansijaIndex] };
  } catch (error: any) {
    console.error('Update finansija error:', error);
    return { success: false, error: 'Greška pri ažuriranju finansije' };
  }
}

/**
 * Obriši finansiju
 */
export async function deleteFinansija(id: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const finansije = getFinansije();
    const finansijaIndex = finansije.findIndex(f => f.id === id);
    
    if (finansijaIndex === -1) {
      return { success: false, error: 'Finansija nije pronađena' };
    }
    
    finansije.splice(finansijaIndex, 1);
    saveFinansije(finansije);
    
    return { success: true };
  } catch (error: any) {
    console.error('Delete finansija error:', error);
    return { success: false, error: 'Greška pri brisanju finansije' };
  }
}

/**
 * Pretraži finansije
 */
export async function searchFinansije(query: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const finansije = getFinansije();
    const lowerQuery = query.toLowerCase();
    
    const filteredFinansije = finansije.filter(finansija =>
      finansija.opis.toLowerCase().includes(lowerQuery) ||
      finansija.kategorija.toLowerCase().includes(lowerQuery) ||
      finansija.vozilo?.toLowerCase().includes(lowerQuery) ||
      finansija.dokument?.toLowerCase().includes(lowerQuery)
    );
    
    return { success: true, data: filteredFinansije };
  } catch (error: any) {
    console.error('Search finansije error:', error);
    return { success: false, error: 'Greška pri pretraživanju finansija' };
  }
}

/**
 * Dobij finansije po datumu
 */
export async function getFinansijeByDateRange(startDate: string, endDate: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const finansije = getFinansije();
    
    const filteredFinansije = finansije.filter(finansija => {
      const finansijaDatum = new Date(finansija.datum);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return finansijaDatum >= start && finansijaDatum <= end;
    });
    
    return { success: true, data: filteredFinansije };
  } catch (error: any) {
    console.error('Get finansije by date range error:', error);
    return { success: false, error: 'Greška pri dobijanju finansija po datumu' };
  }
}

/**
 * Dobij finansijsku statistiku
 */
export async function getFinansijeStats() {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const finansije = getFinansije();
    
    const prihodi = finansije.filter(f => f.tip === 'prihod');
    const rashodi = finansije.filter(f => f.tip === 'rashod');
    
    const ukupanPrihod = prihodi.reduce((sum, f) => sum + f.iznos, 0);
    const ukupanRashod = rashodi.reduce((sum, f) => sum + f.iznos, 0);
    const profit = ukupanPrihod - ukupanRashod;
    
    return {
      success: true,
      data: {
        ukupanPrihod,
        ukupanRashod,
        profit,
        brojPrihoda: prihodi.length,
        brojRashoda: rashodi.length,
        ukupnoTransakcija: finansije.length
      }
    };
  } catch (error: any) {
    console.error('Get finansije stats error:', error);
    return { success: false, error: 'Greška pri dobijanju statistike' };
  }
}

// Inicijalizuj finansije kad se učita modul
initializeFinansije();