# Contributing to GIAS

Thank you for your interest in contributing to the GIAS Institutional Website & Trust Portal!

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/GIAS-WEBSITE.git`
3. **Create** a feature branch: `git checkout -b feature/my-feature`
4. **Setup** development environment: `./scripts/setup-dev.sh`

## Development Workflow

### Code Style

**Frontend (TypeScript/React):**
- Use ESLint and Prettier (configured in `apps/web/.eslintrc`)
- Functional components with hooks
- Props types defined with interfaces
- CSS via Tailwind (no inline styles)

**Backend (Python):**
- PEP 8 compliance
- Type hints for all functions
- Docstrings for modules and functions
- Black for formatting

```bash
# Format code
npm run format          # Frontend
poetry run black app/   # Backend

# Lint code
npm run lint            # Frontend
poetry run pylint app/  # Backend
```

### Testing

**Frontend:**
```bash
cd apps/web
npm run test:unit       # Unit tests
npm run test:e2e        # E2E tests with Playwright
```

**Backend:**
```bash
cd apps/api
poetry run pytest       # Run all tests
poetry run pytest -v    # Verbose output
poetry run pytest --cov # Coverage report
```

### Commit Messages

Follow conventional commits:
```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(auth): add 2FA support
fix(api): handle null evidence gracefully
docs(deployment): add AWS setup guide
```

## Pull Request Process

1. **Update** documentation as needed
2. **Add** tests for new features
3. **Ensure** all tests pass: `npm run test` && `poetry run pytest`
4. **Request** review from maintainers
5. **Address** feedback and re-request review
6. **Squash** commits before merge

### PR Checklist
- [ ] Follows code style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] No hardcoded secrets or credentials
- [ ] No breaking changes (or documented)

## Feature Development

### Adding a New API Endpoint

1. **Define Pydantic schema** in `apps/api/app/schemas/`
2. **Add database model** in `apps/api/app/models.py`
3. **Create route** in `apps/api/app/routes/`
4. **Write tests** in `apps/api/tests/test_routes.py`
5. **Update docs** in `docs/API.md`

Example:
```python
# apps/api/app/routes/my_feature.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter(prefix="/api/v1/my-feature", tags=["my-feature"])

@router.get("/{id}")
async def get_item(id: str, db: Session = Depends(get_db)):
    """Get item by ID."""
    item = db.query(MyModel).filter(MyModel.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item
```

### Adding a New Frontend Page

1. **Create page file** in `apps/web/app/my-page/page.tsx`
2. **Add layout** if nested: `apps/web/app/my-page/layout.tsx`
3. **Create components** in `apps/web/components/`
4. **Add types** in `apps/web/types/`
5. **Update Header/Footer** navigation if needed

Example:
```typescript
// apps/web/app/my-page/page.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function MyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="container-max py-16">
          <h1>My Page</h1>
        </section>
      </main>
      <Footer />
    </>
  )
}
```

## Documentation

- **README.md**: High-level overview
- **docs/ARCHITECTURE.md**: System design
- **docs/API.md**: API reference
- **docs/DEPLOYMENT.md**: Deployment guide
- **docs/SECURITY.md**: Security architecture
- **Inline comments**: Complex logic

Keep docs up-to-date with code changes.

## Reporting Issues

### Bug Report Template
```
## Describe the bug
A clear description of the issue.

## To Reproduce
Steps to reproduce:
1. Go to '...'
2. Click on '...'

## Expected behavior
What should happen.

## Actual behavior
What actually happens.

## Screenshots
If applicable.

## Environment
- OS: (e.g. Ubuntu 22.04)
- Node version: (e.g. 20.x)
- Python version: (e.g. 3.11)
```

### Feature Request Template
```
## Description
What feature would you like to see?

## Why
Why do you need this feature?

## Proposed Solution
How should this work?

## Alternatives
Any alternative approaches?
```

## Code Review Guidelines

As a reviewer, check:
- ✅ Code follows style guide
- ✅ Tests are comprehensive
- ✅ No security issues
- ✅ Backwards compatible (or breaking change documented)
- ✅ Documentation is clear
- ✅ Performance implications considered

Constructive feedback:
```
// Good
"This could be more efficient using a dictionary lookup instead of a loop."

// Bad
"This is slow and inefficient."
```

## Development Tips

### Debugging
```bash
# Frontend
NEXT_PUBLIC_DEBUG=true npm run dev

# Backend
DEBUG=true poetry run uvicorn main:app --reload

# Docker
docker-compose logs -f [service]
```

### Database Queries
```bash
# Connect to development database
docker-compose exec postgres psql -U gias_user -d gias_db

# Run specific test
poetry run pytest apps/api/tests/test_auth.py::test_login
```

### Git Workflow
```bash
# Keep fork updated
git remote add upstream https://github.com/ACESKYPER/GIAS-WEBSITE.git
git fetch upstream
git rebase upstream/main

# Squash commits
git rebase -i HEAD~3  # Last 3 commits
```

## Deployment of Changes

- **Push to `develop`** → Auto-deploys to staging
- **Push to `main`** → Auto-deploys to production
- **Tag release** → Creates GitHub release

## Support & Questions

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Architecture and design questions
- **Email**: team@gias.institute

## Code of Conduct

- Be respectful and inclusive
- No harassment or discrimination
- Assume good intent
- Address conflicts professionally

---

**Thank you for contributing to GIAS!** 🙏

Your work helps build institutional trust in AI systems worldwide.
