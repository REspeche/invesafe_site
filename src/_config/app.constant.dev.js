mainApp.constant('BASE_URL', {
    'api': 'http://localhost:3000/api',
    'secured': true, //[true:default]
    'dashboard': 'http://localhost:8088/',
    'site': 'http://localhost:8080/'
  })
  .constant('CONSTANTS', {
    'timeout_ajax': 35000, //milliseconds
    'askOpenNewTab': true,
    'regexMail': '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$',
    'maxFileUpload': '10MB',
    'files': {
      'project': [1280, 720],
      'gallery': [1024, 576],
      'category': [800, 450],
      'profile': [400, 400],
      'event': [1280, 720]
    },
    'meta': {
      'keywords': 'IOT, internet of things, internet de las cosas, internet das coisas, financiacion, financiamento, garage, internet, campañas, campaign, campanhas, software, Kickstarter, Indiegogo, Crowdfunding.'
    },
    'recaptcha': '6LdlGIwUAAAAAO4hOFNkT75SytadZPFCckla-EDm'
  })
  .constant('COOKIES', {
    'files': {
      'main'    : 'INVESAFE',
      'settings': 'INVESAFE_SETTINGS',
      'cart'    : 'INVESAFE_CART'
    },
    'domain': 'localhost'
  })
  .constant('LOGIN', {
    email: 'respeche@invesafe.com',
    password: 'pepepepe'
  });
