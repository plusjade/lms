require 'digest'
class User
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :email, type: String
  field :avatar, type: String, default: -> { default_avatar }

  field :uid, type: String
  field :provider, type: String
  field :token, type: String

  validates_uniqueness_of :uid

  def to_api
    {
      id: _id.to_s,
      type: _type,
      name: name,
      email: email,
      avatar: avatar
    }
  end

  def dropbox
    @dropbox ||= DropboxClient.new(token)
  end


  def default_avatar
    return nil unless email

    hash = Digest::MD5.hexdigest(email.to_s.strip.downcase)
    "https://secure.gravatar.com/avatar/#{ hash }.jpg?s=200"
  end

  def self.find_from_omniauth(auth)
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
end
