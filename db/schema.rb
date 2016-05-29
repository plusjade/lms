# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160528235427) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "attendances", force: :cascade do |t|
    t.boolean  "attended",               default: false
    t.boolean  "excused",                default: false
    t.string   "reason",     limit: 255
    t.integer  "user_id"
    t.integer  "lesson_id"
    t.integer  "course_id"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
  end

  create_table "concepts", force: :cascade do |t|
    t.string "slug", limit: 255
  end

  create_table "courses", force: :cascade do |t|
    t.string   "name",           limit: 255
    t.string   "slug",           limit: 255
    t.string   "access_code",    limit: 255
    t.string   "calendar_embed", limit: 255
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "courses_users", id: false, force: :cascade do |t|
    t.integer "course_id"
    t.integer "user_id"
  end

  add_index "courses_users", ["course_id"], name: "index_courses_users_on_course_id", using: :btree
  add_index "courses_users", ["user_id"], name: "index_courses_users_on_user_id", using: :btree

  create_table "feedbacks", force: :cascade do |t|
    t.integer  "comprehension"
    t.integer  "engagement"
    t.integer  "quality"
    t.integer  "pace"
    t.text     "learned"
    t.text     "comments"
    t.text     "questions"
    t.integer  "user_id"
    t.integer  "lesson_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "lessons", force: :cascade do |t|
    t.string   "title",      limit: 255
    t.datetime "date"
    t.float    "lesson"
    t.integer  "week"
    t.integer  "course_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "lessons", ["course_id"], name: "index_lessons_on_course_id", using: :btree

  create_table "quizzes", force: :cascade do |t|
    t.integer "concept_id"
    t.text    "question"
    t.text    "choices",    default: [], array: true
  end

  create_table "raw_emails", force: :cascade do |t|
    t.string   "from"
    t.string   "company"
    t.text     "subject"
    t.text     "raw_text"
    t.text     "raw_html"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",      limit: 255
    t.string   "name",       limit: 255
    t.string   "avatar",     limit: 255
    t.string   "uid",        limit: 255
    t.string   "provider",   limit: 255
    t.string   "token",      limit: 255
    t.string   "type",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

end
