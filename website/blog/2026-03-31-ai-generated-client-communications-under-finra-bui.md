---
slug: ai-generated-client-communications-under-finra-bui
title: "AI-Generated Client Communications Under FINRA: Building Compliance Into Your Make.com Workflows"
authors: [davidsanker]
date: 2026-03-31
---

## TL;DR
- FINRA Rule 2210 requires all client communications be fair, balanced, and supervised — but AI automation often bypasses human review
- FINRA Rule 3110 mandates supervisory procedures for all public communications before distribution, requiring dual approval workflows for marketing content under SEC Marketing Rule
- UAPK Gateway enforces these requirements through policy-driven approvals, audit trails with 6-year S3 Object Lock retention per FINRA Rule 4511, and integration directly into Make.com scenarios

## The Problem

Say you run an SEC/FINRA-registered investment advisor managing $500M in assets. You've built sophisticated Make.com scenarios that generate quarterly portfolio summaries, market outlook emails, and rebalancing recommendations using Claude or GPT-4. The efficiency gains are substantial — instead of your analysts spending 20 hours per quarter manually crafting client communications, your automation handles the heavy lifting.

But you have a compliance problem. FINRA Rule 2210 requires that all communications with the public be "fair and balanced" and not contain "any untrue statement of a material fact." More critically, FINRA Rule 3110 mandates that firms establish supervisory procedures ensuring communications are reviewed before distribution. The rule specifically states that "no communication shall be distributed unless it has been approved by a registered principal."

FINRA Rule 4511 compounds the challenge by requiring 6-year retention of all communications with clients. The SEC Marketing Rule adds another layer: any marketing communications must comply with restrictions on testimonials, performance claims, and hypothetical performance presentations under Section 206(4)-1.

Your current Make.com automation bypasses these safeguards entirely. AI generates content, pulls client data from your CRM, and fires off emails without any human oversight. One algorithmic hallucination about portfolio performance or an overly optimistic market prediction could trigger a regulatory examination that costs hundreds of thousands in legal fees and potential sanctions.

## How UAPK Gateway Handles It

UAPK Gateway sits between your Make.com scenarios and any external action, enforcing compliance policies through a declarative manifest. Here's how the core policy structure looks for investment advisor communications:

```json
{
  "version": "1.0",
  "policies": {
    "client_communication": {
      "approval_workflow": "REQUIRE_APPROVAL",
      "retention_years": 6,
      "time_windows": {
        "allowed_hours": "09:00-17:00",
        "timezone": "America/New_York",
        "exclude_weekends": true
      },
      "budget_limits": {
        "daily": 200,
        "weekly": 1000
      }
    },
    "marketing_content": {
      "approval_workflow": "DUAL_APPROVAL", 
      "reviewers": ["compliance_analyst", "cco"],
      "retention_years": 6,
      "budget_limits": {
        "weekly": 10,
        "monthly": 30
      }
    }
  },
  "tool_restrictions": {
    "denylist": ["social_media_direct_post", "public_blog_publish"],
    "allowlist": ["email_send", "pdf_generate", "crm_update"]
  },
  "counterparty_validation": {
    "client_emails": "REGISTERED_CLIENTS_ONLY",
    "data_source": "salesforce_crm"
  }
}
```

The `REQUIRE_APPROVAL` workflow ensures every client communication hits a compliance queue before distribution. For marketing content, `DUAL_APPROVAL` requires both a compliance analyst and Chief Compliance Officer sign-off, addressing SEC Marketing Rule requirements for heightened oversight of promotional materials.

Budget limits prevent runaway automation — 200 client emails per day gives you operational flexibility while capping exposure if something goes wrong. The time window restrictions ensure communications only go out during market hours when your compliance team is available to handle questions.

Tool restrictions are equally important. The denylist prevents your automation from directly posting to social media or publishing blog content without review. The counterparty allowlist validates that emails only go to registered clients in your CRM, preventing accidental distribution to prospects or the general public without proper disclosure.

## The Integration

Integrating UAPK Gateway into your Make.com scenarios requires adding a single HTTP module before any external communication action. Here's the technical flow:

Your existing scenario structure remains intact — AI generates content, formats it for your brand, pulls client data — but before the final email send, you call UAPK Gateway's `/evaluate` endpoint:

```javascript
// Make.com HTTP module configuration
POST https://gateway.uapk.ai/v1/evaluate
Headers: {
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json"
}
Body: {
  "action_type": "client_communication",
  "content": "{{ai_generated_content}}",
  "recipients": ["{{client_email}}"],
  "metadata": {
    "client_id": "{{crm_client_id}}",
    "portfolio_value": "{{current_aum}}",
    "communication_type": "quarterly_summary"
  }
}
```

The Gateway evaluates this request against your manifest policies. For client communications, it immediately routes to your compliance queue with status `PENDING_APPROVAL`. Your compliance analyst receives a notification with the full content, client context, and approval/rejection options.

If approved, the Gateway returns a `200` response with an execution token:

```json
{
  "status": "approved",
  "execution_token": "exec_abc123",
  "approved_by": "compliance_analyst@yourfirm.com",
  "approved_at": "2024-03-15T14:30:00Z",
  "retention_policy": "6_years_s3_lock"
}
```

Your Make.com scenario uses this token to proceed with the email send. If rejected, the scenario terminates and logs the rejection reason.

For marketing content, the dual approval workflow requires both compliance analyst and CCO approval before returning an execution token. This typically adds 2-4 hours to the process but ensures SEC Marketing Rule compliance.

The beauty of this architecture is that your existing Make.com logic remains unchanged. You're not rebuilding automation — you're adding a compliance layer that enforces regulatory requirements without disrupting operational efficiency.

## Compliance Mapping

Each FINRA and SEC requirement maps to specific UAPK Gateway enforcement mechanisms:

**FINRA Rule 2210 (Communications with the Public)**
- Requirement: All communications must be fair, balanced, and not misleading
- UAPK Enforcement: `REQUIRE_APPROVAL` workflow ensures human review of AI-generated content before distribution
- Implementation: Compliance analyst reviews content for accuracy, tone, and regulatory compliance

**FINRA Rule 3110 (Supervisory Procedures)**  
- Requirement: Written supervisory procedures for reviewing communications before distribution
- UAPK Enforcement: Manifest-defined approval workflows with role-based reviewers
- Implementation: All `client_communication` actions route to compliance queue; no execution without approval token

**FINRA Rule 4511 (Record Retention)**
- Requirement: 6-year retention of all client communications
- UAPK Enforcement: Automatic audit trail with S3 Object Lock immutable storage
- Implementation: Every approved action generates immutable audit record with content, approver, timestamp, and client metadata

**SEC Marketing Rule (17 CFR 275.206(4)-1)**
- Requirement: Enhanced oversight of promotional materials and performance claims
- UAPK Enforcement: `DUAL_APPROVAL` workflow for marketing content requiring compliance analyst + CCO sign-off
- Implementation: Marketing communications require two-tier approval with specialized reviewers trained on SEC advertising restrictions

**FINRA Rule 2111 (Suitability)**
- Requirement: Recommendations must be suitable for client's investment profile
- UAPK Enforcement: Counterparty validation ensures communications only go to registered clients with known profiles
- Implementation: CRM integration validates client registration status and investment objectives before allowing rebalancing recommendations

The audit trail for each communication includes the original AI prompt, generated content, all approval steps, final delivery confirmation, and immutable timestamps. This creates a complete regulatory audit trail that survives examinations.

## What This Looks Like in Practice

Let's walk through a typical quarterly portfolio summary generation:

1. **Make.com Trigger**: Calendar automation triggers quarterly portfolio review scenario
2. **Data Gathering**: Scenario pulls client portfolio data, market performance, and AI-generated market outlook
3. **Content Generation**: GPT-4 creates personalized portfolio summary with performance attribution and outlook
4. **UAPK Gateway Check**: HTTP module calls `/evaluate` with action_type `client_communication`
5. **Policy Evaluation**: Gateway checks manifest policies — requires approval, validates client in CRM, confirms within budget limits
6. **Approval Queue**: Content routes to compliance analyst dashboard with full context
7. **Human Review**: Compliance analyst reviews for accuracy, removes any unsuitable performance projections, approves content
8. **Execution**: Gateway returns approval token, Make.com scenario proceeds with email send
9. **Audit Trail**: Immutable record created with original content, modifications, approver, and delivery confirmation

For a rejected communication, the flow terminates at step 7. The compliance analyst might flag inappropriate performance claims or market predictions that could mislead clients. The rejection reason gets logged, and your team can refine the AI prompts to avoid similar issues.

Marketing content follows a similar flow but requires dual approval. When your automation generates a market outlook email intended for prospects, both the compliance analyst and CCO must approve before distribution. This typically happens within 4 hours during business days, maintaining operational efficiency while ensuring SEC Marketing Rule compliance.

The time window restrictions prevent your automation from sending client communications at 2 AM when nobody's available to handle responses. Budget limits ensure that even if your automation malfunctions, you won't exceed reasonable communication volumes that might trigger regulatory scrutiny.

## Conclusion

Running AI-powered client communications as a registered investment advisor requires more than just technological sophistication — it demands regulatory compliance built into every workflow. UAPK Gateway transforms Make.com from a compliance risk into a compliant automation platform by enforcing FINRA supervisory requirements, maintaining SEC-compliant audit trails, and ensuring human oversight of AI-generated content.

The key insight is that compliance doesn't have to break automation. By adding a policy layer between your Make.com scenarios and external actions, you maintain operational efficiency while meeting regulatory obligations. Your quarterly portfolio summaries still get generated automatically, but now they're reviewed by humans, properly archived, and delivered through compliant channels.

This approach scales across your entire investment advisor operation — from client communications to marketing content to rebalancing recommendations. Every AI-generated action gets the appropriate level of human oversight, creating a defensible audit trail that survives regulatory examinations.

Ready to build compliant AI automation? Check out the [UAPK Gateway documentation](https://docs.uapk.ai) or use our [manifest builder](https://gateway.uapk.ai/builder) to create policies for your specific regulatory environment.

compliance, finra, sec, investment advisor, AI automation, make.com, regulatory technology, financial services