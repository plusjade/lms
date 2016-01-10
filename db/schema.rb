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

ActiveRecord::Schema.define(version: 20151212114347) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "attendances", force: true do |t|
    t.boolean  "attended",   default: false
    t.boolean  "excused",    default: false
    t.string   "reason"
    t.integer  "user_id"
    t.integer  "lesson_id"
    t.integer  "course_id"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "courses", force: true do |t|
    t.string   "name"
    t.string   "slug"
    t.string   "access_code"
    t.string   "calendar_embed"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "courses_users", id: false, force: true do |t|
    t.integer "course_id"
    t.integer "user_id"
  end

  add_index "courses_users", ["course_id"], name: "index_courses_users_on_course_id", using: :btree
  add_index "courses_users", ["user_id"], name: "index_courses_users_on_user_id", using: :btree

  create_table "feedbacks", force: true do |t|
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

  create_table "lessons", force: true do |t|
    t.string   "title"
    t.datetime "date"
    t.float    "lesson"
    t.integer  "week"
    t.integer  "course_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "lessons", ["course_id"], name: "index_lessons_on_course_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "email"
    t.string   "name"
    t.string   "avatar"
    t.string   "uid"
    t.string   "provider"
    t.string   "token"
    t.string   "type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
