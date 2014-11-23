Rails.application.config.middleware.use OmniAuth::Builder do
  provider :dropbox_oauth2, $sesames['dropbox']['key'], $sesames['dropbox']['secret']
end