class PagesController < ApplicationController
  def index
    directory = File.join(Rails.root, "app", "views", "pages")
    @pages = Dir["#{directory}/*.html.haml"].map{ |a| File.basename(a, ".html.haml")}
    @pages.delete("index")

    render "index", layout: false
  end

  def show
    render params[:id]
  end
end
