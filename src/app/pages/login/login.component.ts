import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <div class="login-icon">
            <img src="assets/logo/smartQrLogo.svg" alt="Smart QR Logo" class="logo-image" />
          </div>
          <h1>Developer Docs</h1>
          <p>Sign in to access Smart QR documentation</p>
        </div>

        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label>Username</label>
            <div class="input-wrapper">
              <i class="bi bi-person"></i>
              <input type="text" [(ngModel)]="username" name="username"
                     placeholder="Enter your username" required autofocus />
            </div>
          </div>
          <div class="form-group">
            <label>Password</label>
            <div class="input-wrapper">
              <i class="bi bi-lock"></i>
              <input [type]="showPassword ? 'text' : 'password'"
                     [(ngModel)]="password" name="password"
                     placeholder="Enter your password" required />
              <button type="button" class="btn-eye" (click)="showPassword = !showPassword">
                <i class="bi" [class.bi-eye]="!showPassword" [class.bi-eye-slash]="showPassword"></i>
              </button>
            </div>
          </div>

          <div class="error-msg" *ngIf="errorMessage">
            <i class="bi bi-exclamation-circle"></i>
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-login" [disabled]="loading">
            <span *ngIf="!loading">Sign In</span>
            <span *ngIf="loading">Signing in...</span>
          </button>
        </form>

        <div class="login-footer">
          <small>Smart QR Pro &copy; {{ currentYear }}</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      background-image: linear-gradient(rgba(255, 255, 255, 0.74), rgba(255, 255, 255, 0.664));
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    .login-card {
      background: #fff;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .login-icon {
      width: 100px; height: auto;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    .logo-image { width: 100%; height: 100%; object-fit: contain; }
    .login-header h1 { font-size: 22px; font-weight: 700; color: #1a1f36; margin: 0 0 6px; }
    .login-header p { font-size: 14px; color: #888; margin: 0; }

    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; color: #444; margin-bottom: 6px; }
    .input-wrapper {
      display: flex;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 10px;
      padding: 0 14px;
      transition: border-color 0.2s;
    }
    .input-wrapper:focus-within { border-color: #6c8cff; box-shadow: 0 0 0 3px rgba(108,140,255,0.12); }
    .input-wrapper i { color: #999; font-size: 16px; }
    .input-wrapper input {
      border: none;
      outline: none;
      flex: 1;
      padding: 12px 10px;
      font-size: 14px;
    }
    .btn-eye { background: none; border: none; color: #999; cursor: pointer; padding: 4px; }

    .error-msg {
      background: #fff0f0;
      color: #d44;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-login {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #6c8cff, #4a6cf7);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.1s, box-shadow 0.2s;
    }
    .btn-login:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(108,140,255,0.4); }
    .btn-login:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

    .login-footer {
      text-align: center;
      margin-top: 24px;
      color: #aaa;
      font-size: 12px;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  username = '';
  password = '';
  errorMessage = '';
  loading = false;
  showPassword = false;
  currentYear = new Date().getFullYear();

  async onLogin() {
    this.errorMessage = '';
    this.loading = true;
    try {
      const success = await this.authService.login(this.username, this.password);
      if (success) {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/welcome';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.errorMessage = 'Invalid username or password';
      }
    } catch {
      this.errorMessage = 'Login failed. Please try again.';
    }
    this.loading = false;
  }
}
