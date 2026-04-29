import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { AuthDomainPlaygroundComponent } from './auth-domain-playground.component';

describe('AuthDomainPlaygroundComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthDomainPlaygroundComponent],
      providers: [provideHttpClient()]
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the playground header and controls', () => {
    const fixture = TestBed.createComponent(AuthDomainPlaygroundComponent);
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.hero-title h2'))?.nativeElement?.textContent ?? '';
    expect(title).toContain('Authentication UI Playground');

    const selects = fixture.debugElement.queryAll(By.css('.hero-controls select'));
    expect(selects.length).toBe(2);
  });

  it('shows validation errors when submitting login with missing fields', () => {
    const fixture = TestBed.createComponent(AuthDomainPlaygroundComponent);
    fixture.detectChanges();

    const submit = fixture.debugElement.query(By.css('form.card button[type="submit"]'))!.nativeElement as HTMLButtonElement;
    submit.click();
    fixture.detectChanges();

    const errors = fixture.debugElement.queryAll(By.css('form.card .error'));
    expect(errors.length).toBeGreaterThan(0);
  });

  it('enables a simulated login success after valid input', async () => {
    const fixture = TestBed.createComponent(AuthDomainPlaygroundComponent);
    fixture.detectChanges();

    const c = fixture.componentInstance;
    c.loginForm.patchValue({ usercode: 'user@example.com', passcode: 'P@ssw0rd!' });
    fixture.detectChanges();

    await c.submitLogin();
    fixture.detectChanges();

    expect(c.results.login?.variant).toBe('success');
  });

  it('simulates MFA-required login and pre-fills OTP form', async () => {
    const fixture = TestBed.createComponent(AuthDomainPlaygroundComponent);
    fixture.detectChanges(false);

    const c = fixture.componentInstance;
    c.loginForm.patchValue({
      usercode: 'user@example.com',
      passcode: 'P@ssw0rd!',
      simulateMfaRequired: true
    });

    await c.submitLogin();
    fixture.detectChanges(false);

    expect(c.results.login?.label).toBe('MfaRequired');
    expect(c.otpForm.value.userId).toBeTruthy();
    expect(c.otpForm.value.otpCode).toBe('123456');
  });

  it('expires OTP timer after countdown reaches 0', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AuthDomainPlaygroundComponent);
    fixture.detectChanges(false);

    const c = fixture.componentInstance;
    c.restartOtpTimer(1);
    fixture.detectChanges(false);

    vi.runOnlyPendingTimers();
    fixture.detectChanges(false);

    vi.advanceTimersByTime(61_000);
    fixture.detectChanges(false);

    expect(c.otpTimerState).toBe('expired');
  });
});
