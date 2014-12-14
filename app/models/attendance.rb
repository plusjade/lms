class Attendance
  include Mongoid::Document

  belongs_to :student
  belongs_to :lesson
  belongs_to :course

  field :attended, type: Boolean, default: false
  field :excused, type: Boolean, default: false
  field :reason, type: String

  before_create :denormalize

  def denormalize
    self.course = lesson.course
  end

  def self.overview(course)
    students = course.students.entries
    lessons = course.lessons.where(:date.lte => Date.today).entries
    lesson_totals = Array.new(lessons.count, 0)

    data = {}
    where(course: course).overview_data["results"].each do |d|
      data[d["_id"].to_s] = d["value"]["data"]
    end

    student_data = []
    students.each do |student|
      student_id = student.id.to_s
      attended = 0
      node = student.to_api
      node["attendances"] = []

      lessons.each_with_index do |lesson, i|
        did_attend = (data[student_id] && data[student_id][lesson.id.to_s]) ?
                      data[student_id][lesson.id.to_s] :
                      false

        if did_attend
          attended += 1
          lesson_totals[i] += 1
        end

        node["attendances"] << did_attend
      end

      node["attended"] = attended
      node["percent"] = percent_format(attended, lessons.count)

      student_data << node
    end

    lessons_data = lessons.each_with_index.map do |a, i|
                    b = a.to_api
                    b["attended"] = lesson_totals[i]
                    b["percent"] = percent_format(lesson_totals[i], students.count)
                    b
                  end

    attended = lesson_totals.inject(:+)
    total = students.count* lessons.count

    {
      students: student_data,
      lessons: lessons_data,
      aggregate: {
        attended: attended,
        total: total,
        percent: percent_format(attended, total)
      }
    }
  end

  def self.percent_format(part, whole)
    ((part/whole.to_f)*100).round(1)
  end

  def self.overview_data
    map = %Q{
      function() {
        var payload = {};
        payload[this.lesson_id.valueOf()] = this.attended;

        emit(this.student_id.valueOf(), { "data" : payload })
      }
    }

    reduce = %Q{
      function(key, values) {
        var reduced = { "data": {} };
        for (var i in values) {
          var datum = values[i];
          for (var token in datum.data) {
            reduced.data[token] = datum.data[token];
          }
        }

        return reduced;
      }
    }

    map_reduce(map, reduce).out(inline: 1)
  end
end
