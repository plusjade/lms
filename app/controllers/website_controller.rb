class WebsiteController < ApplicationController
  respond_to :json

  def sync
    user = User.find(params[:id])
    authorize! :manage, user

    unless user.dropbox
      raise ArgumentError, "Dropbox integration is required."
    end

    website = Website.new(user.dropbox, user.name)
    endpoint = website.sync

    render json: { endpoint: endpoint }

  rescue ArgumentError => e
    Raven.capture_exception(e)
    render json: { error: e.message }, status: :unauthorized
  rescue DropboxError => e
    Raven.capture_exception(e)
    render json: { error: "DropboxError: " + e.message }, status: :bad_request
  end
end
