require 'aws/s3'
require 'aws/route_53'

# Todo: bucket_names should be unique to avoid overwriting other sites.
class Website
  BucketNamespace = 'carrot-'

  def initialize(dropbox, bucket_name)
    @bucket_name = self.class.format_bucket_name(bucket_name)
    if self.class.valid_bucket_name?(@bucket_name)
      raise ArgumentError, "Invalid Bucket Name"
    end

    # Namespace all buckets to mitigate vandals!
    @bucket_name =  BucketNamespace + @bucket_name

    @dropbox = dropbox
    @dropbox_folder = 'website'
  end

  def bucket
    @bucket ||= begin
      s3 = AWS::S3.new
      s3.buckets[@bucket_name]
    end
  end

  def sync(io=nil)
    s3 = AWS::S3.new
    bucket = s3.buckets[@bucket_name]

    bucket_files = []
    if bucket.exists?
      bucket_files = bucket.objects.map(&:key)
    else
      puts "Bucket['#{ @bucket_name }'] does not exist. Creating it..."

      bucket = s3.buckets.create(@bucket_name)
    end

    policy = AWS::S3::Policy.new
    policy.allow(
      :actions => [:get_object],
      :resources => ["arn:aws:s3:::#{ bucket.name }/*"],
      :principals => :any)
    bucket.policy = policy

    website_config_options = {}
    website_config_options[:index_document] = { suffix: 'index.html' }
    website_config_options[:error_document] = { key: 'error.html' }
    website_config = AWS::S3::WebsiteConfiguration.new(website_config_options)

    bucket.website_configuration = website_config

    puts "Syncing Files:"
    write_file(bucket, io) if io
    #added_files = files_from_dropbox
    # Turn off deleting for now
    # (bucket_files - added_files).each do |key|
    #   obj = bucket.objects[key]
    #   obj.delete
    #   puts "  DEL: #{ obj.inspect }"
    # end

    location = bucket.location_constraint || 'us-east-1'
    endpoint = "http://#{ @bucket_name }.s3-website-#{ location }.amazonaws.com"

    puts "Website published to:"
    puts "  #{ endpoint }"
    endpoint
  end

  def write_file(bucket, io)
    path = File.basename(io.original_filename)
    mime_type = MIME::Types.type_for(File.basename(io.path))[0].to_s
    obj = bucket.objects[path].write(io.read, content_type: mime_type)
    obj.key
  end

  def files_from_dropbox
    added_files = []
    get_files(@dropbox_folder).each do |file|
      content = @dropbox.get_file(file['path'])
      relative_path = file['path'].gsub(%r{^\/#{ @dropbox_folder }\/}, '')
      obj = bucket.objects[relative_path].write(content, content_type: file['mime_type'])
      added_files << obj.key

      puts "  ADD: #{ obj.inspect }"
    end
    added_files
  end

  def self.format_bucket_name(name)
    name.to_s.strip.downcase.gsub(/[^\w]/, '-').gsub(/-+/, '-')
  end

  # Used to present the user with our best guess, until the site is actually published.
  def self.endpoint_guess(name)
    "http://#{ BucketNamespace + format_bucket_name(name) }.s3-website-us-east-1.amazonaws.com"
  end

  def self.valid_bucket_name?(name)
    name.blank? || !AWS::S3::Client.dns_compatible_bucket_name?(name)
  end

  private

  def get_files(folder, memo=[])
    @dropbox.metadata(folder)['contents'].each do |file|
      if file['is_dir']
        sleep 0.1
        memo = get_files(file['path'], memo)
      else
        memo << file
      end
    end

    memo
  end
end
