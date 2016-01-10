require 'rest-client'
class SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:google_auth_client]

  def create
    reset_session
    client = DropboxClient.new(auth_hash.credentials.token)

    user = User.find_from_omniauth(auth_hash).first

    if user
      # update the token
      user.set(token: auth_hash.credentials.token)
    else
      # ensure everyone starts as a student.
      user = Student.create_from_omniauth!(auth_hash)
    end

    session[:user_id] = user.id.to_s

    redirect_to(custom_destination || root_url)
  end

  def google_auth_client
    auth = get_google_token_info(params[:token])
    if auth["aud"].to_s.start_with?($sesames["google"]["key"])
      user = User.find_from_omniauth({provider: "google", uid: auth["sub"]}).first
      user ||= Student.create_from_google!(auth)
      raise ActiveRecord::RecordNotFound unless user

      session[:user_id] = user.id.to_s #login
      render json: {data: {user: user}}
    else
      raise ArgumentError
    end
  end

  def get_google_token_info(token)
    r = RestClient.get("https://www.googleapis.com/oauth2/v3/tokeninfo", {
        params: {id_token: token}, accept: :json
      }
    )
    MultiJson.decode(r)
  end

  def destroy
    reset_session
    respond_to do |format|
      format.json do
        head :ok
      end
      format.any do
        redirect_to root_url
      end
    end
  end

  def failure
    redirect_to root_url, :alert => "Authentication error: #{params[:message].humanize}"
  end


  protected

  def auth_hash
    request.env['omniauth.auth']
  end

  def custom_destination
    if request.env["omniauth.params"] && request.env["omniauth.params"]["goto"]
      request.env["omniauth.params"]["goto"][0] == '/' ?
        request.env["omniauth.params"]["goto"] :
        '/' + request.env["omniauth.params"]["goto"]
    end
  end
end
