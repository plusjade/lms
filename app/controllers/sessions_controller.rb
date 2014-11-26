class SessionsController < ApplicationController
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
