select * from aep_users;
select * from aep_contacts;
select * from aep_appointments;
select * from aep_events;
select * from aep_policies;

select distinct eventstatus from aep_events;

select aep_contacts.contact_id, aep_contacts.name
, aep_appointments.*
from aep_appointments 
join aep_contacts on aep_contacts.contact_id = aep_appointments.contact_id
join aep_events on aep_events.event_id = aep_appointments.event_id
where eventstatus = 'Planned'
and aep_events.user_id = '501'
order by appointment_time;

-- total by status
select count(aep_appointments.id) total_appointments
	, eventstatus
from aep_appointments 
join aep_events on aep_events.event_id = aep_appointments.event_id
group by eventstatus;

-- total by agent
select count(aep_appointments.id) total_appointments
	, eventstatus, aep_users.user_id, aep_users.name
from aep_appointments 
join aep_events on aep_events.event_id = aep_appointments.event_id
join aep_users on aep_users.user_id = aep_events.user_id
group by eventstatus, aep_users.user_id, aep_users.name
order by aep_users.user_id;

-- TOP 10 agents (result)
select cast(count(aep_appointments.id) as integer) total_appointments
	, aep_users.user_id, aep_users.name
from aep_appointments 
left join aep_events on aep_events.event_id = aep_appointments.event_id
left join aep_users on aep_users.user_id = aep_events.user_id
where eventstatus = 'AEP Review Complete'
group by aep_users.user_id, aep_users.name
order by total_appointments desc
limit 10;

-- TOP 10 scheduler agents (result)
select cast(count(aep_appointments.id) as integer) total_appointments
	, aep_users.user_id, aep_users.name
from aep_appointments 
left join aep_events on aep_events.event_id = aep_appointments.event_id
left join aep_users on aep_users.user_id = aep_events.user_id
where eventstatus in ('Planned')
group by aep_users.user_id, aep_users.name
order by total_appointments desc
limit 10;

-- distribution by period
select count(aep_appointments.id) total_appointments
	, eventstatus, date_trunc('month', aep_appointments.appointment_time) ref_month
from aep_appointments 
join aep_events on aep_events.event_id = aep_appointments.event_id
join aep_users on aep_users.user_id = aep_events.user_id
group by eventstatus, date_trunc('month', aep_appointments.appointment_time)
order by ref_month;

-- planned x complete x cancelled
select date_trunc('month', aep_appointments.created_time) ref_lead_month
	, sum(case when eventstatus not in ('AEP Review Complete', 'Cancelled', 'Incompleted') then 1 else 0 end) total_planned
	, sum(case when eventstatus = 'Incompleted' then 1 else 0 end) total_incomplete
	, sum(case when eventstatus = 'AEP Review Complete' then 1 else 0 end) total_complete
	, sum(case when eventstatus = 'Cancelled' then 1 else 0 end) total_cancelled
	, count(aep_appointments.id) total
from aep_appointments 
join aep_events on aep_events.event_id = aep_appointments.event_id
group by date_trunc('month', aep_appointments.created_time)
order by ref_lead_month;

-- agents available x appointments monthly
select count(aep_appointments.id) total_appointments
	, eventstatus, aep_users.user_id, aep_users.name, date_trunc('month', aep_appointments.appointment_time) ref_month
from aep_appointments 
join aep_events on aep_events.event_id = aep_appointments.event_id
join aep_users on aep_users.user_id = aep_events.user_id
where eventstatus = 'AEP Review Complete'
group by eventstatus, aep_users.user_id, aep_users.name, date_trunc('month', aep_appointments.appointment_time)
order by aep_users.user_id;

-- policy completed x planned

-- percentage without attempt to contact