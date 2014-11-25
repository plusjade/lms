if Rails.env.production?
  require 'raven'

  Raven.configure do |config|
    config.dsn = $sesames['sentry-raven']['dsn']
  end
end
