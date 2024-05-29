export default [
  { id: 1, role: 'STATS', link: '/', title: 'sidebar.statistics', icon: 'dataTreemap' },
  { id: 2, role: 'MEMBERS', link: '/members', title: 'sidebar.members', icon: 'personStarburst' },
  {
    id: 3,
    group: {
      title: 'sidebar.groupBase',
      groupItems: [
        {
          id: 2,
          role: 'KIND_OF_ACTIVITY',
          link: '/kind-of-activity',
          title: 'sidebar.kindOfActivity',
          icon: 'layerDiagonalPerson'
        },
        { id: 11, role: 'MINISTRIES', link: '/ministries', title: 'sidebar.ministries', icon: 'groupList' },
        {
          id: 3,
          role: 'LOCALIZATION',
          link: '/localization',
          title: 'sidebar.localization',
          icon: 'globe',
          sub: [
            { id: 3.1, role: 'LOCALIZATION', link: '/localization/county', title: 'sidebar.country' },
            { id: 3.2, role: 'LOCALIZATION', link: '/localization/region', title: 'sidebar.region' }
          ]
        },
        { id: 1, role: 'INDIVIDUALS', link: '/individuals', title: 'sidebar.individual', icon: 'documentBulletList' }
      ]
    }
  },
  {
    id: 4,
    group: {
      title: 'sidebar.groupOrganizations',
      groupItems: [
        { id: 1, role: 'ENTREPRENEURS', link: '/entrepreneurs', title: 'sidebar.entrepreneurs', icon: 'patient' },
        {
          id: 2,
          role: 'GOVERNMENT_ORGANIZATION',
          link: '/government-organizations',
          title: 'sidebar.governmentOrganization',
          icon: 'homeMore'
        },
        {
          id: 3,
          role: 'HOUSEHOLD_SOCIETIES',
          link: '/household-societies',
          title: 'sidebar.businessCompanies',
          icon: 'textBulletListSquarePerson'
        },
        {
          id: 4,
          role: 'PRIVATE_COMPANIES',
          link: '/private-companies',
          title: 'sidebar.privateEnterprices',
          icon: 'homePerson'
        },
        {
          id: 5,
          role: 'FOREIGN_COMPANIES',
          link: '/foreign-companies',
          title: 'sidebar.foreignCompany',
          icon: 'globeSurface'
        }
      ]
    }
  },

  { id: 10, role: 'NEWSLETTERS', link: '/newsletters', title: 'sidebar.newsLetters', icon: 'calendarChat' },
  {
    id: 13,
    role: 'USER_SETTINGS',
    link: '/user-settings',
    title: 'sidebar.userSettings',
    icon: 'settings',
    sub: [
      { id: 13.1, role: 'USER_SETTINGS', link: '/user-settings/job-title', title: 'sidebar.jobTitle' },
      { id: 13.2, role: 'USER_SETTINGS', link: '/user-settings/users', title: 'sidebar.users' }
    ]
  }
]

// export default [
//   { id: 1, role: 'STATS', link: '/', title: 'sidebar.statistics', icon: 'dataTreemap' },
//   { id: 2, role: 'MEMBERS', link: '/members', title: 'sidebar.members', icon: 'personStarburst' },
//   { id: 3, role: 'INDIVIDUALS', link: '/individuals', title: 'sidebar.individual', icon: 'documentBulletList' },
//   { id: 4, role: 'KIND_OF_ACTIVITY', link: '/kind-of-activity', title: 'sidebar.kindOfActivity', icon: 'layerDiagonalPerson' },
//   { id: 5, role: 'ENTREPRENEURS', link: '/entrepreneurs', title: 'sidebar.entrepreneurs', icon: 'patient' },
//   { id: 6, role: 'GOVERNMENT_ORGANIZATION', link: '/government-organizations', title: 'sidebar.governmentOrganization', icon: 'homeMore' },
//   { id: 7, role: 'HOUSEHOLD_SOCIETIES', link: '/household-societies', title: 'sidebar.businessCompanies', icon: 'textBulletListSquarePerson' },
//   { id: 8, role: 'PRIVATE_COMPANIES', link: '/private-companies', title: 'sidebar.privateEnterprices', icon: 'homePerson' },
//   { id: 9, role: 'FOREIGN_COMPANIES', link: '/foreign-companies', title: 'sidebar.foreignCompany', icon: 'globeSurface' },
//   { id: 10, role: 'NEWSLETTERS', link: '/newsletters', title: 'sidebar.newsLetters', icon: 'calendarChat' },
//   { id: 11, role: 'MINISTRIES', link: '/ministries', title: 'sidebar.ministries', icon: 'groupList' },
//   {
//     id: 12,
//     role: 'LOCALIZATION',
//     link: '/localization',
//     title: 'sidebar.localization',
//     icon: 'globe',
//     sub: [
//       { id: 12.1, role: 'LOCALIZATION', link: '/localization/county', title: 'sidebar.country' },
//       { id: 12.2, role: 'LOCALIZATION', link: '/localization/region', title: 'sidebar.region' }
//     ]
//   },
//   {
//     id: 13,
//     role: 'USER_SETTINGS',
//     link: '/user-settings',
//     title: 'sidebar.userSettings',
//     icon: 'settings',
//     sub: [
//       { id: 13.1, role: 'USER_SETTINGS', link: '/user-settings/job-title', title: 'sidebar.jobTitle' },
//       { id: 13.2, role: 'USER_SETTINGS', link: '/user-settings/users', title: 'sidebar.users' }
//     ]
//   }
// ]
