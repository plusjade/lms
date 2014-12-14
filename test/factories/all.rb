require 'securerandom'

# Create a test course environment with sample data for users to trial:
#
#   $ rails c
#   > require 'forgery' ; require 'factory_girl' ; FactoryGirl.reload
#   > c = FactoryGirl.create(:course, :with_lessons, name: "Sample")
#   > FactoryGirl.create_list(:student, 12, :full_sample, courses: [c])
#   > c.teachers << Teacher.first ; c.save
FactoryGirl.define do
  factory :course do
    name { Forgery('name').industry }

    trait :with_lessons do
      after(:create) do |course, evaluator|
        FactoryGirl.create_list(:lesson, 12, course: course)
      end
    end
  end

  factory :lesson do
    title { Forgery('name').company_name + ' ' + Forgery('name').company_name }
    sequence(:date) { |n| (Date.today - 100) + (n*2) }
    sequence(:lesson) { |n| n }
  end

  factory :student do
    name { Forgery('name').full_name }
    email { "#{ name.gsub(' ', '-').downcase }@example.com" }
    uid { SecureRandom.urlsafe_base64(6) }
    courses { [] }

    trait :full_sample do
      after(:create) do |student, evaluator|
        evaluator.courses.first.lessons.each do |lesson|
          puts lesson.title
          FactoryGirl.create(:attendance, lesson: lesson, student: student)
          FactoryGirl.create(:feedback, lesson: lesson, student: student)
        end
      end
    end
  end

  factory :attendance do
    student
    lesson
    attended { [true, false].sample }
  end

  factory :feedback do
    student
    lesson

    comprehension { (1..5).to_a.sample }
    engagement { (1..5).to_a.sample }
    quality { (1..5).to_a.sample }
    pace { (1..5).to_a.sample }

    learned { Forgery::LoremIpsum.paragraphs((1..3).to_a.sample) }
    comments { Forgery::LoremIpsum.paragraphs((1..3).to_a.sample) }
    questions { Forgery::LoremIpsum.paragraphs((1..3).to_a.sample) }
  end
end
