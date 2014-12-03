class MaterialsController < ApplicationController

  rescue_from DropboxError do |exception|
    Raven.capture_exception(exception)
    render nothing: true, status: :not_found
  end

  def index
    lesson = Lesson.find(params[:lesson_id])
    authorize! :read, lesson

    course = lesson.course

    dropbox = course.lead_teacher.dropbox

    scoped_path = "#{ course.slug }/lesson-#{ lesson.lesson.to_i }"

    materials = dropbox.metadata(scoped_path)
    materials["path"] = scoped_path
    materials['dl'] = make_dl_path(course.id, scoped_path.split('/').pop)
    materials['contents'].each do |file|
      path = file['path'].split('/')
      path.shift ; path.shift

      file['dl'] = make_dl_path(course.id, path.join('/'))
      file['path'] = path.pop
    end

    render json: { materials: materials }
  rescue DropboxError => exception
    Raven.capture_exception(exception)
    render json: { materials: { path: scoped_path } }
  end

  # Proxy to redirect the request to a direct download via Dropbox share URL.
  # Note the share URL expires but issuing a share request at time of should solve this.
  def show
    course = Course.find(params[:course_id].to_s)
    authorize! :read, course

    dropbox = course.lead_teacher.dropbox

    meta = dropbox.shares("/#{ course.slug }/#{ params[:id] }", false)
    url = meta["url"].split('?').first
    url += '?dl=1'

    redirect_to url
  end

  private

  def make_dl_path(course_id, path)
    "/courses/#{ course_id }/materials/#{ path }"
  end
end
