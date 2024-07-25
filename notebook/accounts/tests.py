from django.test import TestCase
from django.contrib.auth import get_user_model, authenticate

CustomUser = get_user_model()

class CustomUserTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email='test@gmail.com',
            password='testing321',
            first_name='Test',
            last_name='User'
        )

    def test_create_user(self):
        self.assertEqual(self.user.email, 'test@gmail.com')
        self.assertTrue(self.user.check_password('testing321'))
        self.assertEqual(self.user.first_name, 'Test')
        self.assertEqual(self.user.last_name, 'User')

    def test_user_email_uniqueness(self):
        with self.assertRaises(Exception):
            CustomUser.objects.create_user(email='test@gmail.com', password='testing321')

    def test_authenticate_with_email(self):
        user = authenticate(username='test@gmail.com', password='testing321')
        self.assertIsNotNone(user)
        self.assertEqual(user.email, 'test@gmail.com')

    def test_authenticate_with_invalid_email(self):
        user = authenticate(username='invalid@gmail.com', password='testing321')
        self.assertIsNone(user)

    def test_authenticate_with_invalid_password(self):
        user = authenticate(username='test@gmail.com', password='wrongpassword')
        self.assertIsNone(user)

    def test_superuser(self):
        admin_user = CustomUser.objects.create_superuser(
            email='admin@gmail.com',
            password='testing321',
            first_name='Admin',
            last_name='User'
        )
        self.assertEqual(admin_user.email, 'admin@gmail.com')
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

    def test_user_representation(self):
        self.assertEqual(str(self.user), 'test@gmail.com')
