"""Manually update password column type

Revision ID: a72cf90c9ca4
Revises: 
Create Date: 2025-06-23 20:09:17.880730

"""
from alembic import op
import sqlalchemy as sa

revision = 'a72cf90c9ca4'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.alter_column('user', 'password',
        existing_type=sa.String(length=50),
        type_=sa.Text(),
        existing_nullable=False
    )

def downgrade():
    op.alter_column('user', 'password',
        existing_type=sa.Text(),
        type_=sa.String(length=50),
        existing_nullable=False
    )