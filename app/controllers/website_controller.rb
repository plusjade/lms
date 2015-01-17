class WebsiteController < ApplicationController

  def index
    @course = Course.find(params[:id])
    @lesson = @course.lessons.gte(date: Date.today).first

    authorize! :read, @course

    render template: "courses/show"
  end

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
