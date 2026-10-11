[
  {
    "table_name": "applications",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "applications",
    "column_name": "job_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "applications",
    "column_name": "student_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "applications",
    "column_name": "resume_id",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "applications",
    "column_name": "cover_letter",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "applications",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO"
  },
  {
    "table_name": "applications",
    "column_name": "applied_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "applications",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "audit_logs",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "audit_logs",
    "column_name": "actor_profile_id",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "audit_logs",
    "column_name": "action",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "audit_logs",
    "column_name": "entity_type",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "audit_logs",
    "column_name": "entity_id",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "audit_logs",
    "column_name": "metadata",
    "data_type": "jsonb",
    "is_nullable": "NO"
  },
  {
    "table_name": "audit_logs",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "career_roadmaps",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "career_roadmaps",
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "career_roadmaps",
    "column_name": "slug",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "career_roadmaps",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "career_roadmaps",
    "column_name": "target_role",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "career_roadmaps",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO"
  },
  {
    "table_name": "career_roadmaps",
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "career_roadmaps",
    "column_name": "published_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "career_roadmaps",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "career_roadmaps",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenge_skills",
    "column_name": "challenge_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenge_skills",
    "column_name": "skill_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenge_submissions",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenge_submissions",
    "column_name": "challenge_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenge_submissions",
    "column_name": "student_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenge_submissions",
    "column_name": "language",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenge_submissions",
    "column_name": "code",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenge_submissions",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenge_submissions",
    "column_name": "score",
    "data_type": "numeric",
    "is_nullable": "YES"
  },
  {
    "table_name": "challenge_submissions",
    "column_name": "execution_result",
    "data_type": "jsonb",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenge_submissions",
    "column_name": "submitted_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenge_submissions",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenges",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenges",
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenges",
    "column_name": "slug",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenges",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenges",
    "column_name": "difficulty",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenges",
    "column_name": "time_limit_minutes",
    "data_type": "integer",
    "is_nullable": "YES"
  },
  {
    "table_name": "challenges",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenges",
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "challenges",
    "column_name": "published_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "challenges",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "challenges",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "companies",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "companies",
    "column_name": "name",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "companies",
    "column_name": "slug",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "companies",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "companies",
    "column_name": "website_url",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "companies",
    "column_name": "logo_url",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "companies",
    "column_name": "industry",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "companies",
    "column_name": "location_city",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "companies",
    "column_name": "location_state",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "companies",
    "column_name": "location_country",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "companies",
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "companies",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "companies",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "company_members",
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "company_members",
    "column_name": "profile_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "company_members",
    "column_name": "role",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO"
  },
  {
    "table_name": "company_members",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO"
  },
  {
    "table_name": "company_members",
    "column_name": "joined_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "company_members",
    "column_name": "left_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "events",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "events",
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "events",
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "events",
    "column_name": "event_type",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO"
  },
  {
    "table_name": "events",
    "column_name": "organizer_name",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "events",
    "column_name": "source_name",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "events",
    "column_name": "source_external_id",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "events",
    "column_name": "source_url",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "events",
    "column_name": "registration_url",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "events",
    "column_name": "city",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "events",
    "column_name": "state",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "events",
    "column_name": "country",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "table_name": "events",
    "column_name": "latitude",
    "data_type": "numeric",
    "is_nullable": "YES"
  },
  {
    "table_name": "events",
    "column_name": "longitude",
    "data_type": "numeric",
    "is_nullable": "YES"
  },
  {
    "table_name": "events",
    "column_name": "starts_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "events",
    "column_name": "ends_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "table_name": "events",
    "column_name": "status",
    "data_type": "USER-DEFINED",
    "is_nullable": "NO"
  },
  {
    "table_name": "events",
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "events",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "events",
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "job_requirements",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "job_requirements",
    "column_name": "job_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "job_requirements",
    "column_name": "requirement_text",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "table_name": "job_requirements",
    "column_name": "is_required",
    "data_type": "boolean",
    "is_nullable": "NO"
  },
  {
    "table_name": "job_requirements",
    "column_name": "sort_order",
    "data_type": "integer",
    "is_nullable": "NO"
  },
  {
    "table_name": "job_requirements",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "table_name": "job_skills",
    "column_name": "job_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "job_skills",
    "column_name": "skill_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "job_skills",
    "column_name": "is_required",
    "data_type": "boolean",
    "is_nullable": "NO"
  },
  {
    "table_name": "jobs",
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "jobs",
    "column_name": "company_id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "table_name": "jobs",
    "column_name": "created_by",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "table_name": "jobs",
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO"
  }
]