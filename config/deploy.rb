require 'capistrano/ext/multistage'
require "bundler/capistrano"

default_run_options[:shell] = '/bin/bash'
set :ruby_version, "1.9.3"
set :chruby_script, "/usr/local/share/chruby/chruby.sh"
set :set_ruby_cmd, ". #{chruby_script} && chruby #{ruby_version}"
set(:bundle_cmd) {
  "#{set_ruby_cmd} && exec bundle"
}

set :stages, %w(staging production)
set :default_stage, 'production'

set :application, "blog"
set :repository,  "git@github.com:wyeworks/#{application}.git"

set :scm, :git
set :deploy_via, :remote_cache
ssh_options[:forward_agent] = true

set :normalize_asset_timestamps, false
