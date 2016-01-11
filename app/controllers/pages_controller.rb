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
end
