// LocalStorage Vozila Service za demo verziju

export interface DemoVozilo {
  id: string;
  registracija: string;
  marka: string;
  model: string;
  godinaProizvodnje: number;
  tipGoriva: string;
  kilometraza: number;
  status: 'aktivno' | 'neaktivno' | 'servis';
  zadnjiServis?: string;
  sledecaRegistracija?: string;
  nosivost?: number;
  napomene?: string;
  createdAt: string;
  updatedAt: string;
}

// Demo vozila
const getDefaultVozila = (): DemoVozilo[] => [
  {
    id: '1',
    registracija: 'BG-123-AB',
    marka: 'Mercedes',
    model: 'Sprinter',
    godinaProizvodnje: 2020,
    tipGoriva: 'dizel',
    kilometraza: 150000,
    status: 'aktivno',
    zadnjiServis: '2024-09-15',
    sledecaRegistracija: '2025-03-15',
    nosivost: 3500,
    napomene: 'Redovno održavano vozilo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    registracija: 'NS-456-CD',
    marka: 'Volvo',
    model: 'FH16',
    godinaProizvodnje: 2019,
    tipGoriva: 'dizel',
    kilometraza: 280000,
    status: 'aktivno',
    zadnjiServis: '2024-08-22',
    sledecaRegistracija: '2025-01-20',
    nosivost: 40000,
    napomene: 'Kamion za dugotrajne rute',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    registracija: 'KG-789-EF',
    marka: 'Iveco',
    model: 'Daily',
    godinaProizvodnje: 2021,
    tipGoriva: 'dizel',
    kilometraza: 95000,
    status: 'servis',
    zadnjiServis: '2024-10-10',
    sledecaRegistracija: '2025-05-10',
    nosivost: 7000,
    napomene: 'U servisu zbog redovnog održavanja',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    registracija: 'NI-321-GH',
    marka: 'MAN',
    model: 'TGX',
    godinaProizvodnje: 2018,
    tipGoriva: 'dizel',
    kilometraza: 420000,
    status: 'aktivno',
    zadnjiServis: '2024-07-30',
    sledecaRegistracija: '2024-12-15',
    nosivost: 44000,
    napomene: 'Visoka kilometraza, potreban temeljniji pregled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    registracija: 'SU-654-IJ',
    marka: 'Ford',
    model: 'Transit',
    godinaProizvodnje: 2022,
    tipGoriva: 'dizel',
    kilometraza: 45000,
    status: 'aktivno',
    zadnjiServis: '2024-09-05',
    sledecaRegistracija: '2025-07-20',
    nosivost: 2300,
    napomene: 'Novo vozilo za gradske isporuke',
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
      vozilo.marka.toLowerCase().includes(lowerQuery) ||
      vozilo.model.toLowerCase().includes(lowerQuery) ||
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