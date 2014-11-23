class SessionsController < ApplicationController
  def create
    reset_session
    client = DropboxClient.new(auth_hash.credentials.token)

    user = Student.find_or_create_from_omniauth(auth_hash)
    session[:user_id] = user.id.to_s

    redirect_to root_url
  end

  def destroy
    reset_session
    redirect_to root_url
  end

  def failure
    redirect_to root_url, :alert => "Authentication error: #{params[:message].humanize}"
  end


  protected

  def auth_hash
    request.env['omniauth.auth']
  end
end
