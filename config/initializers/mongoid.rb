module Mongoid
  module Document
    def created_at_from_id
      _id.generation_time
    end

    def created_at_from_id_human
      created_at_from_id.strftime("%b %d, %Y %l:%M %p")
    end

    def created_at_human
      created_at ?
        created_at.strftime("%b %d, %Y %l:%M %p") :
        nil
    end

    def updated_at_human
      updated_at ?
        updated_at.strftime("%b %d, %Y %l:%M %p") :
        nil
    end
  end
end
