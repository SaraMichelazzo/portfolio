require 'sinatra'

if development?
  require 'sinatra/reloader'
end

get '/' do
  @page = 'work'
  erb :index
end

get '/index' do
  redirect '/'
end

get '/about' do
  @page = 'about'
  erb :about
end

get '/solairplmux' do
  @page = 'work'
  erb :solairux
end

get '/linkedin' do
  @page = 'work'
  erb :linkedin
end

get '/solairsite' do
  @page = 'work'
  erb :solairwebsite
end

get '/truespirit' do
  @page = 'work'
  erb :truespirit
end

get '/iphoneapp' do
  @page = 'work'
  erb :iphoneapp
end

get '/gocatch' do
  @page = 'work'
  erb :gocatch
end