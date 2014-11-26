if Rails.env.production?
  require 'raven'

  Raven.configure do |config|
    config.dsn = $sesames['sentry-raven']['dsn']
  end
else
  module Raven
    def self.capture_exception(exception)
    end
  end
end
