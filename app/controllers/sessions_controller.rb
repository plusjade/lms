class SessionsController < ApplicationController
  def destroy
    reset_session
    redirect_to root_url
  end
end
