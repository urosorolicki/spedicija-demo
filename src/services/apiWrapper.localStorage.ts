// Auth functions
export { 
  loginUser as login, 
  registerUser as register, 
  deleteUser, 
  getAllUsers,
  changeUserPassword
} from './authService.localStorage';

// Vozila functions  
export { 
  getAllVozila as getVozila, 
  createVozilo, 
  updateVozilo, 
  deleteVozilo, 
  searchVozila 
} from './vozilaService.localStorage';

// Finansije functions
export { 
  getAllFinansije as getFinansije, 
  createFinansija, 
  updateFinansija, 
  deleteFinansija 
} from './finansijeService.localStorage';

// Materijal functions
export { 
  getAllMaterijal as getMaterijali, 
  createMaterijal, 
  updateMaterijal, 
  deleteMaterijal 
} from './materijalService.localStorage';