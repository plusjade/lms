require 'digest'
class User < ActiveRecord::Base
  validates_uniqueness_of :uid

  def to_api
    {
      id: id.to_s,
      type: type,
      name: name,
      email: email,
      avatar: avatar,
      website: website_endpoint,
      url: Rails.application.routes.url_helpers.user_path(id)
    }
  end

  def website_endpoint
    Website.endpoint_guess(name)
  end

  def dropbox
    return nil unless token
    @dropbox ||= DropboxClient.new(token)
  end


  def default_avatar
    return nil unless email

    hash = Digest::MD5.hexdigest(email.to_s.strip.downcase)
    "https://secure.gravatar.com/avatar/#{ hash }.jpg?s=200"
  end

  def self.find_from_omniauth(auth)
    auth = HashWithIndifferentAccess.new(auth)
    where({
        provider: auth['provider'],
        uid: auth['uid'].to_s
    })
  end

  def self.create_from_omniauth!(auth)
    create! do |u|
      u.provider = auth['provider']
      u.uid = auth['uid']
      u.token = auth.credentials.token
      if auth['info']
         u.name = auth['info']['name'] || ""
         u.email = auth['info']['email'] || ""
      end
    end
  end

  def self.create_from_google!(auth)
    create! do |u|
      u.provider = "google"
      u.uid = auth["sub"]
      u.name = auth["name"]
      u.email = auth["email"]
    end
  end
end
