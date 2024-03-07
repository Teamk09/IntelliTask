from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class LogoutTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = Token.objects.create(user=self.user)

    def test_logout(self):
        # Simulate logout request
        response = self.client.post('/api/logout/', HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.assertEqual(response.status_code, 200)

        # Verify token is deleted
        with self.assertRaises(Token.DoesNotExist):
            Token.objects.get(key=self.token.key)
