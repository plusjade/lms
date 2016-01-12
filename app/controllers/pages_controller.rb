class PagesController < ApplicationController
  def index
    directory = File.join(Rails.root, "app", "views", "pages")
    @pages = Dir["#{directory}/*.html.haml"].map{ |a| File.basename(a, ".html.haml")}
    @pages.delete("index")

    render "index", layout: false
  end

  def show
    @concept = Concept.find_by_slug(params[:id])
    render params[:id]
  end

  def home
    render "home/home"
  end

  def website
    authorize! :create, :website
    render "home/website"
  end

  def website_add
    uploaded_io = params[:document]
    #puts uploaded_io.pretty_inspect

    if uploaded_io
      website = Website.new(nil, current_user.name)
      endpoint = website.sync(uploaded_io)
    end

    redirect_to "/website"
  end
end
