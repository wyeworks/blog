require 'octopress-date-format'

module Octopress
  module PageDate
    def self.date_html(date, time=true)
      tag =  "<time class='entry-date' datetime='#{ date.xmlschema }'>"
      tag += "<span class='date updated'>#{format_date(date, true)}</span>"
      if time
        tag += " <span class='time'>#{format_time(date)}</span>" if time
      end
      tag += "</time>"
    end
  end
end
