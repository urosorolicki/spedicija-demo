// LocalStorage Materijal Service za demo verziju

export interface DemoMaterijal {
  id: string;
  naziv: string;
  kategorija: string;
  kolicina: number;
  jedinica: string;
  cenaPoJedinici: number;
  ukupnaVrednost: number;
  dobavljac?: string;
  lokacijaSkladista: string;
  minimalnaKolicina?: number;
  datumNabavke: string;
  datumIsteka?: string;
  opis?: string;
  napomene?: string;
  createdAt: string;
  updatedAt: string;
}

// Demo materijal
const getDefaultMaterijal = (): DemoMaterijal[] => [
  {
    id: '1',
    naziv: 'Dizel gorivo',
    kategorija: 'Gorivo',
    kolicina: 5000,
    jedinica: 'litar',
    cenaPoJedinici: 170,
    ukupnaVrednost: 850000,
    dobavljac: 'NIS Petrol',
    lokacijaSkladista: 'Glavni rezervoar',
    minimalnaKolicina: 1000,
    datumNabavke: '2024-10-15',
    opis: 'Dizel gorivo za kamione',
    napomene: 'Redovno dopunjavanje',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    naziv: 'Motorno ulje SAE 15W-40',
    kategorija: 'Maziva',
    kolicina: 200,
    jedinica: 'litar',
    cenaPoJedinici: 450,
    ukupnaVrednost: 90000,
    dobavljac: 'Castrol',
    lokacijaSkladista: 'Skladište A - Polica 1',
    minimalnaKolicina: 50,
    datumNabavke: '2024-09-20',
    datumIsteka: '2026-09-20',
    opis: 'Sintetičko motorno ulje za teške uslove',
    napomene: 'Za kamione i teška vozila',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    naziv: 'Kamionske gume 315/80R22.5',
    kategorija: 'Gume',
    kolicina: 24,
    jedinica: 'komad',
    cenaPoJedinici: 35000,
    ukupnaVrednost: 840000,
    dobavljac: 'Michelin Serbia',
    lokacijaSkladista: 'Gumara - Sektor B',
    minimalnaKolicina: 8,
    datumNabavke: '2024-08-10',
    opis: 'Zimske gume za kamione',
    napomene: 'M+S označene, DOT 2024',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    naziv: 'Kočione pločice',
    kategorija: 'Rezervni delovi',
    kolicina: 16,
    jedinica: 'set',
    cenaPoJedinici: 12000,
    ukupnaVrednost: 192000,
    dobavljac: 'Bosch Auto Delovi',
    lokacijaSkladista: 'Skladište A - Polica 3',
    minimalnaKolicina: 4,
    datumNabavke: '2024-09-05',
    opis: 'Prednje kočione pločice za Volvo FH',
    napomene: 'OEM kvalitet',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    naziv: 'AdBlue tečnost',
    kategorija: 'Aditivi',
    kolicina: 1000,
    jedinica: 'litar',
    cenaPoJedinici: 120,
    ukupnaVrednost: 120000,
    dobavljac: 'Total Srbija',
    lokacijaSkladista: 'Rezervoar AdBlue',
    minimalnaKolicina: 200,
    datumNabavke: '2024-10-01',
    datumIsteka: '2025-10-01',
    opis: 'DEF tečnost za smanjenje NOx emisija',
    napomene: 'ISO 22241 standard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    naziv: 'Filteri za ulje',
    kategorija: 'Filteri',
    kolicina: 50,
    jedinica: 'komad',
    cenaPoJedinici: 2500,
    ukupnaVrednost: 125000,
    dobavljac: 'Mann Filter',
    lokacijaSkladista: 'Skladište A - Polica 2',
    minimalnaKolicina: 10,
    datumNabavke: '2024-09-15',
    opis: 'Originalni filteri za motorno ulje',
    napomene: 'Različite veličine u asortimanu',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    naziv: 'Antifrizi G12+',
    kategorija: 'Tečnosti',
    kolicina: 300,
    jedinica: 'litar',
    cenaPoJedinici: 680,
    ukupnaVrednost: 204000,
    dobavljac: 'Liqui Moly',
    lokacijaSkladista: 'Skladište B - Zona 1',
    minimalnaKolicina: 50,
    datumNabavke: '2024-08-25',
    datumIsteka: '2027-08-25',
    opis: 'Koncentrat antifrizera za hladnjak',
    napomene: 'Mešati sa destilovanom vodom 1:1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    naziv: 'Zavrtnji M12x35',
    kategorija: 'Spojni materijal',
    kolicina: 500,
    jedinica: 'komad',
    cenaPoJedinici: 45,
    ukupnaVrednost: 22500,
    dobavljac: 'Tehnometal',
    lokacijaSkladista: 'Skladište A - Fioka 12',
    minimalnaKolicina: 100,
    datumNabavke: '2024-07-10',
    opis: 'Inox zavrtnji za teške uslove',
    napomene: 'Klasa čvrstoće 8.8',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const STORAGE_KEY = 'spedicija_demo_materijal';

// Inicijalizuj materijal ako ne postoji
const initializeMaterijal = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getDefaultMaterijal()));
  }
};

// Dobij sav materijal
const getMaterijal = (): DemoMaterijal[] => {
  initializeMaterijal();
  const materijal = localStorage.getItem(STORAGE_KEY);
  return materijal ? JSON.parse(materijal) : getDefaultMaterijal();
};

// Sačuvaj materijal
const saveMaterijal = (materijal: DemoMaterijal[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(materijal));
};

/**
 * Dobij sav materijal
 */
export async function getAllMaterijal() {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const materijal = getMaterijal();
    return { success: true, data: materijal };
  } catch (error: any) {
    console.error('Get materijal error:', error);
    return { success: false, error: 'Greška pri dobijanju materijala' };
  }
}

/**
 * Dobij materijal po ID
 */
export async function getMaterijalById(id: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const materijal = getMaterijal();
    const item = materijal.find(m => m.id === id);
    
    if (!item) {
      return { success: false, error: 'Materijal nije pronađen' };
    }
    
    return { success: true, data: item };
  } catch (error: any) {
    console.error('Get materijal by ID error:', error);
    return { success: false, error: 'Greška pri dobijanju materijala' };
  }
}

/**
 * Kreiraj novi materijal
 */
export async function createMaterijal(materijalData: Omit<DemoMaterijal, 'id' | 'ukupnaVrednost' | 'createdAt' | 'updatedAt'>) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const materijal = getMaterijal();
    
    // Izračunaj ukupnu vrednost
    const ukupnaVrednost = materijalData.kolicina * materijalData.cenaPoJedinici;
    
    const noviMaterijal: DemoMaterijal = {
      ...materijalData,
      id: Date.now().toString(),
      ukupnaVrednost,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    materijal.push(noviMaterijal);
    saveMaterijal(materijal);
    
    return { success: true, data: noviMaterijal };
  } catch (error: any) {
    console.error('Create materijal error:', error);
    return { success: false, error: 'Greška pri kreiranju materijala' };
  }
}

/**
 * Ažuriraj materijal
 */
export async function updateMaterijal(id: string, materijalData: Partial<Omit<DemoMaterijal, 'id' | 'createdAt'>>) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const materijal = getMaterijal();
    const materijalIndex = materijal.findIndex(m => m.id === id);
    
    if (materijalIndex === -1) {
      return { success: false, error: 'Materijal nije pronađen' };
    }
    
    const updatedMaterijal = {
      ...materijal[materijalIndex],
      ...materijalData,
      updatedAt: new Date().toISOString()
    };
    
    // Preračunaj ukupnu vrednost ako su promenjeni kolicina ili cena
    if (materijalData.kolicina !== undefined || materijalData.cenaPoJedinici !== undefined) {
      updatedMaterijal.ukupnaVrednost = updatedMaterijal.kolicina * updatedMaterijal.cenaPoJedinici;
    }
    
    materijal[materijalIndex] = updatedMaterijal;
    saveMaterijal(materijal);
    
    return { success: true, data: updatedMaterijal };
  } catch (error: any) {
    console.error('Update materijal error:', error);
    return { success: false, error: 'Greška pri ažuriranju materijala' };
  }
}

/**
 * Obriši materijal
 */
export async function deleteMaterijal(id: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const materijal = getMaterijal();
    const materijalIndex = materijal.findIndex(m => m.id === id);
    
    if (materijalIndex === -1) {
      return { success: false, error: 'Materijal nije pronađen' };
    }
    
    materijal.splice(materijalIndex, 1);
    saveMaterijal(materijal);
    
    return { success: true };
  } catch (error: any) {
    console.error('Delete materijal error:', error);
    return { success: false, error: 'Greška pri brisanju materijala' };
  }
}

/**
 * Pretraži materijal
 */
export async function searchMaterijal(query: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const materijal = getMaterijal();
    const lowerQuery = query.toLowerCase();
    
    const filteredMaterijal = materijal.filter(item =>
      item.naziv.toLowerCase().includes(lowerQuery) ||
      item.kategorija.toLowerCase().includes(lowerQuery) ||
      item.dobavljac?.toLowerCase().includes(lowerQuery) ||
      item.lokacijaSkladista.toLowerCase().includes(lowerQuery)
    );
    
    return { success: true, data: filteredMaterijal };
  } catch (error: any) {
    console.error('Search materijal error:', error);
    return { success: false, error: 'Greška pri pretraživanju materijala' };
  }
}

/**
 * Dobij materijal sa niskim zalihama
 */
export async function getLowStockMaterijal() {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const materijal = getMaterijal();
    
    const lowStockItems = materijal.filter(item => 
      item.minimalnaKolicina && item.kolicina <= item.minimalnaKolicina
    );
    
    return { success: true, data: lowStockItems };
  } catch (error: any) {
    console.error('Get low stock materijal error:', error);
    return { success: false, error: 'Greška pri dobijanju materijala sa niskim zalihama' };
  }
}

/**
 * Dobij statistiku materijala
 */
export async function getMaterijalStats() {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const materijal = getMaterijal();
    
    const ukupnaVrednost = materijal.reduce((sum, item) => sum + item.ukupnaVrednost, 0);
    const brojStavki = materijal.length;
    const kategorije = [...new Set(materijal.map(item => item.kategorija))];
    const lowStockCount = materijal.filter(item => 
      item.minimalnaKolicina && item.kolicina <= item.minimalnaKolicina
    ).length;
    
    return {
      success: true,
      data: {
        ukupnaVrednost,
        brojStavki,
        brojKategorija: kategorije.length,
        lowStockCount,
        kategorije
      }
    };
  } catch (error: any) {
    console.error('Get materijal stats error:', error);
    return { success: false, error: 'Greška pri dobijanju statistike materijala' };
  }
}

/**
 * Ažuriraj količinu materijala (dodaj/oduzmi)
 */
export async function updateMaterijalQuantity(id: string, quantityChange: number, reason?: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const materijal = getMaterijal();
    const materijalIndex = materijal.findIndex(m => m.id === id);
    
    if (materijalIndex === -1) {
      return { success: false, error: 'Materijal nije pronađen' };
    }
    
    const currentItem = materijal[materijalIndex];
    const newQuantity = currentItem.kolicina + quantityChange;
    
    if (newQuantity < 0) {
      return { success: false, error: 'Količina ne može biti negativna' };
    }
    
    materijal[materijalIndex] = {
      ...currentItem,
      kolicina: newQuantity,
      ukupnaVrednost: newQuantity * currentItem.cenaPoJedinici,
      updatedAt: new Date().toISOString(),
      napomene: reason ? `${currentItem.napomene || ''}\n${new Date().toLocaleDateString()}: ${reason}` : currentItem.napomene
    };
    
    saveMaterijal(materijal);
    
    return { success: true, data: materijal[materijalIndex] };
  } catch (error: any) {
    console.error('Update materijal quantity error:', error);
    return { success: false, error: 'Greška pri ažuriranju količine' };
  }
}

// Inicijalizuj materijal kad se učita modul
initializeMaterijal();