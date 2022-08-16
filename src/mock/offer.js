export const generateOffers = () => ([
  {
    type: 'taxi',
    offers: [
      {
        'id': 1,
        'title': 'Upgrade to a business class',
        'price': 120
      },
      {
        'id': 2,
        'title': 'Meet with a sign',
        'price': 20
      },
      {
        'id': 3,
        'title': 'Take luggage',
        'price': 40
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        'id': 1,
        'title': 'Add luggage',
        'price': 50
      },
      {
        'id': 2,
        'title': 'Add meal',
        'price': 10
      }
    ]
  }
]);
