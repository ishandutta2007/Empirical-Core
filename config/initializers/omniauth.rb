require 'omniauth'



options = {provider_ignores_state: true}

Rails.application.config.middleware.use OmniAuth::Builder do
  # provider :developer, ENV["SCHOOLOGY_KEY"], ENV["SCHOOLOGY_SECRET"], options
  provider :schoology, ENV["SCHOOLOGY_KEY"], ENV["SCHOOLOGY_SECRET"], options
  provider :clever, Clever::CLIENT_ID, Clever::CLIENT_SECRET, options
  provider :google_oauth2, ENV["GOOGLE_CLIENT_ID"], ENV["GOOGLE_CLIENT_SECRET"],
    {
      skip_jwt: true,
      scope: ['email',
              'profile',
              'classroom.courses.readonly',
              'classroom.rosters.readonly',
              'classroom.profile.emails'],
      access_type: 'offline'
    }
end

OmniAuth.config.logger = Rails.logger
OmniAuth.config.on_failure = Proc.new { |env|
  OmniAuth::FailureEndpoint.new(env).redirect_to_failure
} unless Rails.env.development?
