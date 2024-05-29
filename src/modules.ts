import { registerModules } from './helpers/register-modules'

import login from './modules/login'
import home from './modules/home'
import members from './modules/members'
import kindOfActivity from './modules/kindOfActivity'
import individuals from './modules/individuals'
import entrepreneurs from './modules/entrepreneurs'
import governmentOrganizations from './modules/governmentOrganizations'
import householdSocieties from './modules/householdSocieties'
import privateCompany from './modules/privateCompany'
import foreignCompanies from './modules/foreignCompanies'
import newsletters from './modules/newsletters'
import ministries from './modules/ministries'
import localization from './modules/localization'
import userSettings from './modules/userSettings'

registerModules({
  login: login,
  home: home,
  members: members,
  kindOfActivity: kindOfActivity,
  individuals: individuals,
  entrepreneurs: entrepreneurs,
  governmentOrganizations: governmentOrganizations,
  householdSocieties: householdSocieties,
  privateCompany: privateCompany,
  foreignCompanies: foreignCompanies,
  newsletters: newsletters,
  ministries: ministries,
  localization: localization,
  userSettings: userSettings
})
