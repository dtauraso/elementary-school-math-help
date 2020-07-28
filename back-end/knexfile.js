// Update with your config settings.

module.exports = {

  // elementary-school-match-help-dev
  development: {
    client: 'pg',
    connection: {
      database: 'problems',
      user:     'postgres',
      // is this really an issue when they would need my actual computer to access my postgres?
      password: ';/U1waA=.dlE^59b\''
    },
    pool: {
      min: 2,
      max: 10,
    },
    // don't use node v 14
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },

  },

  staging: {
    client: 'pg',
    // in a .env file
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './database/migrations'
    },
    ssl: true,

    seeds: {
      directory: './database/seeds'
    }
  },

  production: {
    client: 'pg',
    // in a .env file
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './database/migrations'
    },
    ssl: true,

    seeds: {
      directory: './database/seeds'
    }
  }

};
