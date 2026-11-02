# Export policy

Create at most one remote export for the requested report. The provider applies idempotency per request_key: resubmitting the same key refers to the original operation, while a new key creates another operation if accepted. A timeout after request transmission leaves the remote outcome unknown. Reconcile by request key before creating a fresh request.
