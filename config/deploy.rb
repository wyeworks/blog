require 'capistrano/ext/multistage'
require "bundler/capistrano"

set :stages, %w(staging production)
set :default_stage, 'production'

set :application, "blog"
set :repository,  "git@github.com:wyeworks/#{application}.git"

set :scm, :git
set :deploy_via, :remote_cache
ssh_options[:forward_agent] = true
