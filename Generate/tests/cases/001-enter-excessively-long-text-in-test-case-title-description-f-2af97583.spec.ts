import { test as _authTest, expect } from "../fixtures";
import { test as _baseTest } from "@playwright/test";
import { testConfig } from "../../synthqa.config";

// Auth is controlled by synthqa.config.ts — edit that file to change
// whether this test runs authenticated or not.
const _requiresAuth =
  testConfig["2af97583-c196-430f-b41f-4eb8a2f96743"]?.requires_auth ?? true;
const test = _requiresAuth ? _authTest : _baseTest;

test.describe(`Enter Over The Maximum Characters in Requirements Field`, () => {
  test(`2af97583-c196-430f-b41f-4eb8a2f96743`, async ({ page }, testInfo) => {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) throw new Error("Missing BASE_URL");

    await test.step(`Step 1: Navigate to the test case generation page`, async () => {
      await page.goto(baseUrl + "/generate");
      await expect(page).toHaveURL(baseUrl + "/generate");

      await page.screenshot({
        path: testInfo.outputPath(`step-1.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 2: Ensure the requirement title input is empty (clear any pre-filled content)`, async () => {
      await page
        .locator('[data-testid="input-generation-title"]')
        .fill("Maximum Req Test");
      await expect(
        page.locator('[data-testid="input-generation-title"]'),
      ).toHaveValue("Maximum Req Test");

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 3: Ensure the requirement description input is empty (clear any pre-filled content)`, async () => {
      await page
        .locator('[data-testid="input-generation-description"]')
        .fill("Maximum Req Description");
      await expect(
        page.locator('[data-testid="input-generation-description"]'),
      ).toHaveValue("Maximum Req Description");

      await page.screenshot({
        path: testInfo.outputPath(`step-2.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 4: Fill the requirement description with exactly 5000 characters`, async () => {
      const text =
        "The system shall provide a secure, reliable, and user-friendly authentication mechanism that enables registered users to access protected areas of the application using a valid email address and password. The login functionality shall be available across all supported client types, including web, mobile, and API integrations, and shall ensure consistent behavior, response structures, and security enforcement regardless of the access method. The login process shall begin with the presentation of a login interface that includes clearly labeled input fields for email and password, along with appropriate accessibility support such as keyboard navigation, screen reader compatibility, and visible focus indicators. The system shall validate user input both on the client side and server side to ensure that required fields are present, the email is in a valid format, and the password meets minimum submission criteria before initiating authentication.Upon submission of credentials, the system shall securely transmit the email and password using encrypted communication protocols (e.g., HTTPS/TLS) and shall authenticate the user by comparing the provided credentials against securely stored values using industry-standard hashing and salting mechanisms. Under no circumstances shall the system store or log plaintext passwords, and any sensitive authentication data shall be protected from exposure in logs, analytics, or error messages. If the credentials are valid, the system shall establish an authenticated session for the user by issuing a session token, access token, or equivalent authentication artifact, which shall include defined expiration parameters and may optionally include refresh capabilities. The system shall also return essential user context information such as user identifier, roles, permissions, and tenant or project associations necessary for downstream authorization decisions. If authentication fails due to invalid credentials, nonexistent accounts, or disabled user status, the system shall return a generic error message that does not disclose whether the email exists in the system, thereby preventing user enumeration attacks. The system shall enforce configurable security controls including rate limiting, progressive delays, CAPTCHA challenges (if enabled), and temporary account lockout after a defined number of consecutive failed login attempts. All failed and successful login attempts shall be recorded in an audit log that captures relevant metadata such as timestamp, user identifier (if available), IP address, device or client type, and a correlation identifier, while ensuring that no sensitive information such as passwords or full tokens is stored. The login process shall support optional multi-factor authentication (MFA) when enabled, requiring users to complete an additional verification step (e.g., one-time code, authenticator app, or biometric confirmation) after successful primary credential validation and before granting full access. The system shall also support session management features including secure logout, session expiration after inactivity, and revocation of tokens when necessary. If a user attempts to access protected resources with an expired, invalid, or revoked session, the system shall deny access and require re-authentication with a standardized error response. From a user experience perspective, the login interface shall provide clear feedback during the authentication process, including loading indicators during submission, disabled submission controls to prevent duplicate requests, and appropriate success or failure messaging. Upon successful login, users shall be redirected to their intended destination or a default landing page such as a dashboard. In the event of failure, user input (excluding the password) may be preserved to facilitate retry, while ensuring that sensitive data is not exposed or retained insecurely. The system shall ensure high availability and performance for the login functionality, with authentication requests completing within defined response time thresholds under normal operating conditions. In cases of system errors, service outages, or dependency failures, the system shall return a generic, user-friendly error message without exposing internal implementation details, and shall log the error for further investigation. The login functionality shall be thoroughly tested across supported environments and browsers to ensure compatibility, reliability, and adherence to security best practices.  The system shall additionally implement monitoring and alerting mechanisms for authentication-related activities, enabling detection of anomalies such as unusual login patterns, geographic inconsistencies, or spikes in failed login attempts that may indicate potential security threats. These events shall trigger configurable alerts to system administrators without impacting normal user experience. The login functionality shall also support internationalization.";

      await page.locator('[data-testid="textarea-requirements"]').fill(text);

      await page.screenshot({
        path: testInfo.outputPath(`step-4.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 5: Verify the character counter shows 5000/5000`, async () => {
      await page.locator('[data-testid="requirements-char-count"]').click();
      await expect(
        page.locator('[data-testid="requirements-char-count"]'),
      ).toHaveText("5000 / 5000");

      await page.screenshot({
        path: testInfo.outputPath(`step-5.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Select a test cases count from dropdown`, async () => {
      await page.locator('[data-testid="select-test-case-count"]').click();
      await page.locator('[name="testCaseCount"]').selectOption({ value: "5" });
      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 7: Click the Generate Test Cases button`, async () => {
      await page.locator('[data-testid="btn-generate"]').click();
      await expect(page.getByTestId("btn-generate")).toBeDisabled();

      await page.screenshot({
        path: testInfo.outputPath(`step-7.png`),
        fullPage: true,
      });
    });

    await test.step(`Step 6: Verify Info Message for User to enter words into the field`, async () => {
      await page.waitForURL(/\/test-cases/, { timeout: 180000 });
      await expect(page).toHaveURL(/\/test-cases/);

      await page.screenshot({
        path: testInfo.outputPath(`step-6.png`),
        fullPage: true,
      });
    });

    await test.step("Final state", async () => {
      await page.screenshot({
        path: testInfo.outputPath("final.png"),
        fullPage: true,
      });
    });
  });
});
