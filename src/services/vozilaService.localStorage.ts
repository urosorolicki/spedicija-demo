// LocalStorage Vozila Service za demo verziju

export interface DemoVozilo {
  id: string;
  naziv: string;
  registracija: string;
  tip: string;
  nosivost: number;
  godiste: number;
  status: string;
  kilometraza: number;
  sledecaRegistracija?: string;
  sledecaRevizijaGorivo?: string;
  createdAt: string;
  updatedAt: string;
}

// Demo vozila
const getDefaultVozila = (): DemoVozilo[] => [
  {
    id: '1',
    naziv: 'Mercedes Sprinter',
    registracija: 'BG-123-AB',
    tip: 'Kombi',
    nosivost: 3500,
    godiste: 2020,
    kilometraza: 150000,
    status: 'aktivan',
    sledecaRegistracija: '2025-03-15',
    sledecaRevizijaGorivo: '2024-12-01',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    naziv: 'Volvo FH16',
    registracija: 'NS-456-CD',
    tip: 'Kiper kamion',
    nosivost: 40000,
    godiste: 2019,
    kilometraza: 280000,
    status: 'aktivan',
    sledecaRegistracija: '2025-01-20',
    sledecaRevizijaGorivo: '2024-11-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    naziv: 'Iveco Daily',
    registracija: 'KG-789-EF',
    tip: 'Kamion',
    nosivost: 7000,
    godiste: 2021,
    kilometraza: 95000,
    status: 'u servisu',
    sledecaRegistracija: '2025-05-10',
    sledecaRevizijaGorivo: '2024-10-20',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    naziv: 'MAN TGX',
    registracija: 'NI-321-GH',
    tip: 'Kiper kamion',
    nosivost: 44000,
    godiste: 2018,
    kilometraza: 420000,
    status: 'aktivan',
    sledecaRegistracija: '2024-12-15',
    sledecaRevizijaGorivo: '2024-09-30',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    naziv: 'Ford Transit',
    registracija: 'SU-654-IJ',
    tip: 'Kombi',
    nosivost: 2300,
    godiste: 2022,
    kilometraza: 45000,
    status: 'aktivan',
    sledecaRegistracija: '2025-07-20',
    sledecaRevizijaGorivo: '2025-01-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const STORAGE_KEY = 'spedicija_demo_vozila';

// Inicijalizuj vozila ako ne postoje
const initializeVozila = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getDefaultVozila()));
  }
};

// Dobij sva vozila
const getVozila = (): DemoVozilo[] => {
  initializeVozila();
  const vozila = localStorage.getItem(STORAGE_KEY);
  return vozila ? JSON.parse(vozila) : getDefaultVozila();
};

// Sačuvaj vozila
const saveVozila = (vozila: DemoVozilo[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vozila));
};

/**
 * Dobij sva vozila
 */
export async function getAllVozila() {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const vozila = getVozila();
    return { success: true, data: vozila };
  } catch (error: any) {
    console.error('Get vozila error:', error);
    return { success: false, error: 'Greška pri dobijanju vozila' };
  }
}

/**
 * Dobij vozilo po ID
 */
export async function getVoziloById(id: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const vozila = getVozila();
    const vozilo = vozila.find(v => v.id === id);
    
    if (!vozilo) {
      return { success: false, error: 'Vozilo nije pronađeno' };
    }
    
    return { success: true, data: vozilo };
  } catch (error: any) {
    console.error('Get vozilo by ID error:', error);
    return { success: false, error: 'Greška pri dobijanju vozila' };
  }
}

/**
 * Kreiraj novo vozilo
 */
export async function createVozilo(voziloData: Omit<DemoVozilo, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const vozila = getVozila();
    
    // Proveri da li registracija već postoji
    const existingVozilo = vozila.find(v => 
      v.registracija.toLowerCase() === voziloData.registracija.toLowerCase()
    );
    
    if (existingVozilo) {
      return { success: false, error: 'Vozilo sa tom registracijom već postoji' };
    }
    
    const novoVozilo: DemoVozilo = {
      ...voziloData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    vozila.push(novoVozilo);
    saveVozila(vozila);
    
    return { success: true, data: novoVozilo };
  } catch (error: any) {
    console.error('Create vozilo error:', error);
    return { success: false, error: 'Greška pri kreiranju vozila' };
  }
}

/**
 * Ažuriraj vozilo
 */
export async function updateVozilo(id: string, voziloData: Partial<Omit<DemoVozilo, 'id' | 'createdAt'>>) {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const vozila = getVozila();
    const voziloIndex = vozila.findIndex(v => v.id === id);
    
    if (voziloIndex === -1) {
      return { success: false, error: 'Vozilo nije pronađeno' };
    }
    
    // Ako se menja registracija, proveri da li već postoji
    if (voziloData.registracija) {
      const existingVozilo = vozila.find(v => 
        v.id !== id && v.registracija.toLowerCase() === voziloData.registracija.toLowerCase()
      );
      
      if (existingVozilo) {
        return { success: false, error: 'Vozilo sa tom registracijom već postoji' };
      }
    }
    
    vozila[voziloIndex] = {
      ...vozila[voziloIndex],
      ...voziloData,
      updatedAt: new Date().toISOString()
    };
    
    saveVozila(vozila);
    
    return { success: true, data: vozila[voziloIndex] };
  } catch (error: any) {
    console.error('Update vozilo error:', error);
    return { success: false, error: 'Greška pri ažuriranju vozila' };
  }
}

/**
 * Obriši vozilo
 */
export async function deleteVozilo(id: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const vozila = getVozila();
    const voziloIndex = vozila.findIndex(v => v.id === id);
    
    if (voziloIndex === -1) {
      return { success: false, error: 'Vozilo nije pronađeno' };
    }
    
    vozila.splice(voziloIndex, 1);
    saveVozila(vozila);
    
    return { success: true };
  } catch (error: any) {
    console.error('Delete vozilo error:', error);
    return { success: false, error: 'Greška pri brisanju vozila' };
  }
}

/**
 * Pretraži vozila
 */
export async function searchVozila(query: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const vozila = getVozila();
    const lowerQuery = query.toLowerCase();
    
    const filteredVozila = vozila.filter(vozilo =>
      vozilo.registracija.toLowerCase().includes(lowerQuery) ||
      vozilo.naziv.toLowerCase().includes(lowerQuery) ||
      vozilo.tip.toLowerCase().includes(lowerQuery) ||
      vozilo.status.toLowerCase().includes(lowerQuery)
    );
    
    return { success: true, data: filteredVozila };
  } catch (error: any) {
    console.error('Search vozila error:', error);
    return { success: false, error: 'Greška pri pretraživanju vozila' };
  }
}

// Inicijalizuj vozila kad se učita modul
initializeVozila();