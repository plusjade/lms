class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_user

  rescue_from CanCan::AccessDenied do |exception|
    respond_to do |format|
      format.html do
        redirect_to root_url(goto: request.original_fullpath), notice: 'Please login first'
      end
      format.json do
        render json: { error: "unauthorized" }, status: :unauthorized
      end
    end
  end

  rescue_from Mongoid::Errors::DocumentNotFound do |exception|
    respond_to do |format|
      format.html do
        render template: "home/not_found", layout: false, status: :not_found
      end
      format.json do
        render json: { error: "not_found" }, status: :not_found
      end
    end
  end

  def current_user
    return nil unless session[:user_id]
    @current_user ||= User.where(id: session[:user_id]).first
  end
end
