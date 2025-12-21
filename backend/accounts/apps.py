from django.apps import AppConfig

class AccountsConfig(AppConfig):
    """Class cấu hình cho ứng dụng accounts"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        """
            Ghi đè phương thức ready để import các tín hiệu.
            Input: None
            Output: None
        """
        import accounts.signals
