// API Wrapper - mapira stari API na novi localStorage API
// Omogućava kompatibilnost bez potrebe za velikim promenama u komponenti

import * as authService from './authService.localStorage';
import * as vozilaService from './vozilaService.localStorage';
import * as finansijeService from './finansijeService.localStorage';
import * as materijalService from './materijalService.localStorage';

// Auth wrapper - već kompatibilan
export const loginUser = authService.loginUser;
export const registerUser = authService.registerUser;
export const changeUserPassword = authService.changeUserPassword;
export const deleteUser = authService.deleteUser;
export const getAllUsers = authService.getAllUsers;

// Vozila wrapper
export async function getVozila(userId?: string) {
  const result = await vozilaService.getAllVozila();
  if (result.success) {
    return { success: true, vozila: result.data };
  }
  return { success: false, error: result.error };
}

export async function createVozilo(userId: string, voziloData: any) {
  // Mapiramo staru strukturu na novu
  const mapped = {
    registracija: voziloData.registracija || '',
    marka: voziloData.naziv?.split(' ')[0] || 'N/A',
    model: voziloData.naziv?.split(' ').slice(1).join(' ') || 'N/A',
    godinaProizvodnje: voziloData.godiste || new Date().getFullYear(),
    tipGoriva: 'dizel',
    kilometraza: voziloData.kilometraza || 0,
    status: (voziloData.status || 'aktivno') as 'aktivno' | 'neaktivno' | 'servis',
    sledecaRegistracija: voziloData.sledecaRegistracija,
    nosivost: voziloData.nosivost,
    napomene: voziloData.opis || ''
  };
  
  return await vozilaService.createVozilo(mapped);
}

export async function updateVozilo(voziloId: string, voziloData: any) {
  const mapped = {
    registracija: voziloData.registracija,
    marka: voziloData.naziv?.split(' ')[0],
    model: voziloData.naziv?.split(' ').slice(1).join(' '),
    godinaProizvodnje: voziloData.godiste,
    tipGoriva: 'dizel',
    kilometraza: voziloData.kilometraza,
    status: voziloData.status as 'aktivno' | 'neaktivno' | 'servis',
    sledecaRegistracija: voziloData.sledecaRegistracija,
    nosivost: voziloData.nosivost,
    napomene: voziloData.opis
  };
  
  return await vozilaService.updateVozilo(voziloId, mapped);
}

export async function deleteVozilo(voziloId: string) {
  return await vozilaService.deleteVozilo(voziloId);
}

// Finansije wrapper
export async function getFinansije(userId?: string) {
  const result = await finansijeService.getAllFinansije();
  if (result.success) {
    return { success: true, finansije: result.data };
  }
  return { success: false, error: result.error };
}

export async function createFinansija(userId: string, finansijaData: any) {
  const mapped = {
    tip: finansijaData.tip as 'prihod' | 'rashod',
    kategorija: finansijaData.kategorija || '',
    opis: finansijaData.opis || '',
    iznos: finansijaData.iznos || 0,
    datum: finansijaData.datum || new Date().toISOString().split('T')[0],
    vozilo: finansijaData.vozilo,
    dokument: finansijaData.dokument,
    napomene: finansijaData.napomene
  };
  
  return await finansijeService.createFinansija(mapped);
}

export async function updateFinansija(finansijaId: string, finansijaData: any) {
  const mapped = {
    tip: finansijaData.tip as 'prihod' | 'rashod',
    kategorija: finansijaData.kategorija,
    opis: finansijaData.opis,
    iznos: finansijaData.iznos,
    datum: finansijaData.datum,
    vozilo: finansijaData.vozilo,
    dokument: finansijaData.dokument,
    napomene: finansijaData.napomene
  };
  
  return await finansijeService.updateFinansija(finansijaId, mapped);
}

export async function deleteFinansija(finansijaId: string) {
  return await finansijeService.deleteFinansija(finansijaId);
}

// Materijal wrapper
export async function getMaterijali(userId?: string) {
  const result = await materijalService.getAllMaterijal();
  if (result.success) {
    return { success: true, materijali: result.data };
  }
  return { success: false, error: result.error };
}

export async function createMaterijal(userId: string, materijalData: any) {
  const mapped = {
    naziv: materijalData.naziv || '',
    kategorija: materijalData.kategorija || '',
    kolicina: materijalData.kolicina || 0,
    jedinica: materijalData.jedinica || 'komad',
    cenaPoJedinici: materijalData.cenaPoJedinici || 0,
    dobavljac: materijalData.dobavljac,
    lokacijaSkladista: materijalData.lokacijaSkladista || 'Skladište',
    minimalnaKolicina: materijalData.minimalnaKolicina,
    datumNabavke: materijalData.datumNabavke || new Date().toISOString().split('T')[0],
    datumIsteka: materijalData.datumIsteka,
    opis: materijalData.opis,
    napomene: materijalData.napomene
  };
  
  return await materijalService.createMaterijal(mapped);
}

export async function updateMaterijal(materijalId: string, materijalData: any) {
  const mapped = {
    naziv: materijalData.naziv,
    kategorija: materijalData.kategorija,
    kolicina: materijalData.kolicina,
    jedinica: materijalData.jedinica,
    cenaPoJedinici: materijalData.cenaPoJedinici,
    dobavljac: materijalData.dobavljac,
    lokacijaSkladista: materijalData.lokacijaSkladista,
    minimalnaKolicina: materijalData.minimalnaKolicina,
    datumNabavke: materijalData.datumNabavke,
    datumIsteka: materijalData.datumIsteka,
    opis: materijalData.opis,
    napomene: materijalData.napomene
  };
  
  return await materijalService.updateMaterijal(materijalId, mapped);
}

export async function deleteMaterijal(materijalId: string) {
  return await materijalService.deleteMaterijal(materijalId);
}