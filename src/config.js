class DCMConfig {
  environment () {
    return 'development'
  }

  getApi () { // always return something with a trailing slash
    return 'https://dc-map-5214.appspot.com/'
  }
}


export const dcMapConfig = new DCMConfig()
